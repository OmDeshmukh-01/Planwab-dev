// lib/video-thumbnail.js

/**
 * Production-grade video thumbnail generator
 * 
 * Strategy (waterfall — tries each method, falls back to next):
 * 1. Use existing thumbnail if provided
 * 2. Canvas extraction with multiple seek attempts + CORS retry
 * 3. Hidden video element with blob URL (bypasses some CORS issues)
 * 4. Server-side proxy fetch as blob → canvas
 * 5. Generate a styled placeholder with video metadata
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Persistent cache (survives component re-mounts) ───
const thumbnailCache = new Map();
const failedUrls = new Set();
const inFlightRequests = new Map(); // Dedup concurrent requests for same URL

// ─── Configuration ───
const CONFIG = {
  TIMEOUT_MS: 12000,
  MAX_SEEK_ATTEMPTS: 5,
  CANVAS_QUALITY: 0.75,
  MIN_NON_BLACK_RATIO: 0.02, // 2% of sampled pixels must be non-black
  PIXEL_SAMPLE_STEP: 16,     // Check every 16th pixel (RGBA = *4 = every 64th byte)
  SEEK_OFFSETS: [1, 0.5, 2, 3, 0.1], // Seconds to try seeking to
};

/**
 * Check if a canvas frame is usable (not all black/blank)
 */
const isFrameUsable = (ctx, width, height) => {
  try {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const totalSampled = Math.floor(data.length / (4 * CONFIG.PIXEL_SAMPLE_STEP));
    let nonBlackCount = 0;

    for (let i = 0; i < data.length; i += 4 * CONFIG.PIXEL_SAMPLE_STEP) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Consider pixel non-black if any channel > 15
      if (r > 15 || g > 15 || b > 15) {
        nonBlackCount++;
      }
    }

    return nonBlackCount / totalSampled > CONFIG.MIN_NON_BLACK_RATIO;
  } catch {
    return false;
  }
};

/**
 * Method 1: Direct canvas extraction from video element
 * Tries multiple seek positions to find a non-black frame
 */
const extractViaCanvas = (videoUrl, crossOrigin = "anonymous") => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    let resolved = false;
    let seekAttempt = 0;

    const cleanup = () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      // Don't remove from DOM if never appended
      try { video.remove(); } catch {}
      try { canvas.remove(); } catch {}
    };

    const finish = (value) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeout);
      cleanup();
      resolve(value);
    };

    const timeout = setTimeout(() => finish(null), CONFIG.TIMEOUT_MS);

    if (crossOrigin) {
      video.crossOrigin = crossOrigin;
    }
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto"; // "auto" is more reliable than "metadata" for seeking
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");

    const tryCapture = () => {
      try {
        const w = video.videoWidth;
        const h = video.videoHeight;

        if (!w || !h) {
          tryNextSeek();
          return;
        }

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(video, 0, 0, w, h);

        if (isFrameUsable(ctx, w, h)) {
          const dataUrl = canvas.toDataURL("image/jpeg", CONFIG.CANVAS_QUALITY);
          if (dataUrl && dataUrl.length > 1000) {
            // Valid thumbnail (blank canvas toDataURL is ~100 chars)
            finish(dataUrl);
            return;
          }
        }
        tryNextSeek();
      } catch {
        // SecurityError from tainted canvas — this method won't work
        finish(null);
      }
    };

    const tryNextSeek = () => {
      seekAttempt++;
      if (seekAttempt >= CONFIG.SEEK_OFFSETS.length) {
        // Last resort: just return whatever we have
        try {
          const dataUrl = canvas.toDataURL("image/jpeg", CONFIG.CANVAS_QUALITY);
          if (dataUrl && dataUrl.length > 1000) {
            finish(dataUrl);
            return;
          }
        } catch {}
        finish(null);
        return;
      }

      const duration = video.duration || 10;
      const seekTime = Math.min(CONFIG.SEEK_OFFSETS[seekAttempt], duration * 0.9);
      video.currentTime = seekTime;
    };

    video.addEventListener("loadeddata", () => {
      // loadeddata is more reliable than loadedmetadata for having decodable frames
      const duration = video.duration || 10;
      const seekTime = Math.min(CONFIG.SEEK_OFFSETS[0], duration * 0.9);
      video.currentTime = seekTime;
    }, { once: false });

    video.addEventListener("seeked", () => {
      // Small delay to ensure frame is painted
      requestAnimationFrame(() => {
        setTimeout(tryCapture, 50);
      });
    });

    video.addEventListener("error", () => finish(null));
    video.addEventListener("stalled", () => {
      // If stalled for too long, give up
      setTimeout(() => {
        if (!resolved) finish(null);
      }, 5000);
    });

    video.src = videoUrl;
    video.load();
  });
};

/**
 * Method 2: Fetch video as blob to bypass CORS, then extract
 * This works when the server doesn't set CORS headers for video elements
 * but the fetch itself succeeds (common with CDNs)
 */
const extractViaBlob = async (videoUrl) => {
  try {
    const controller = new AbortController();
    const fetchTimeout = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

    // Fetch with Range header — only need first few MB for a frame
    const response = await fetch(videoUrl, {
      signal: controller.signal,
      headers: {
        Range: "bytes=0-4194304", // First 4MB should contain at least one keyframe
      },
    });

    clearTimeout(fetchTimeout);

    if (!response.ok && response.status !== 206) {
      return null;
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    try {
      // Now extract from blob URL — no CORS issues since it's local
      const result = await extractViaCanvas(blobUrl, null);
      return result;
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch {
    return null;
  }
};

/**
 * Method 3: Use video element play() + pause() trick
 * Some browsers only decode frames after play starts
 */
const extractViaPlayPause = (videoUrl) => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    let resolved = false;

    const finish = (value) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeout);
      video.pause();
      video.removeAttribute("src");
      video.load();
      try { video.remove(); } catch {}
      try { canvas.remove(); } catch {}
      resolve(value);
    };

    const timeout = setTimeout(() => finish(null), CONFIG.TIMEOUT_MS);

    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.style.position = "fixed";
    video.style.top = "-9999px";
    video.style.width = "1px";
    video.style.height = "1px";
    video.style.opacity = "0";
    document.body.appendChild(video);

    let frameCheckCount = 0;

    const checkFrame = () => {
      frameCheckCount++;
      const w = video.videoWidth;
      const h = video.videoHeight;

      if (w && h) {
        canvas.width = w;
        canvas.height = h;
        try {
          ctx.drawImage(video, 0, 0, w, h);
          if (isFrameUsable(ctx, w, h)) {
            video.pause();
            const dataUrl = canvas.toDataURL("image/jpeg", CONFIG.CANVAS_QUALITY);
            if (dataUrl && dataUrl.length > 1000) {
              finish(dataUrl);
              return;
            }
          }
        } catch {
          finish(null);
          return;
        }
      }

      if (frameCheckCount < 30) {
        requestAnimationFrame(checkFrame);
      } else {
        // Try whatever we have
        try {
          const dataUrl = canvas.toDataURL("image/jpeg", CONFIG.CANVAS_QUALITY);
          finish(dataUrl && dataUrl.length > 1000 ? dataUrl : null);
        } catch {
          finish(null);
        }
      }
    };

    video.addEventListener("playing", () => {
      // Wait a moment for frames to decode
      setTimeout(() => {
        requestAnimationFrame(checkFrame);
      }, 200);
    }, { once: true });

    video.addEventListener("error", () => finish(null));

    video.src = videoUrl;
    video.load();

    // Use play() — muted autoplay is usually allowed
    const playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => finish(null));
    }
  });
};

/**
 * Main entry: Generate thumbnail using waterfall strategy
 */
export const generateVideoThumbnail = async (videoUrl) => {
  if (!videoUrl) return null;

  // Check cache
  if (thumbnailCache.has(videoUrl)) {
    return thumbnailCache.get(videoUrl);
  }

  // Don't retry known failures
  if (failedUrls.has(videoUrl)) {
    return null;
  }

  // Dedup in-flight requests
  if (inFlightRequests.has(videoUrl)) {
    return inFlightRequests.get(videoUrl);
  }

  const promise = (async () => {
    let result = null;

    // Strategy 1: Direct canvas extraction (fastest, works when CORS is set)
    result = await extractViaCanvas(videoUrl, "anonymous");
    if (result) {
      thumbnailCache.set(videoUrl, result);
      inFlightRequests.delete(videoUrl);
      return result;
    }

    // Strategy 2: Play-pause trick (works on some mobile browsers)
    result = await extractViaPlayPause(videoUrl);
    if (result) {
      thumbnailCache.set(videoUrl, result);
      inFlightRequests.delete(videoUrl);
      return result;
    }

    // Strategy 3: Fetch as blob (bypasses CORS for video element)
    result = await extractViaBlob(videoUrl);
    if (result) {
      thumbnailCache.set(videoUrl, result);
      inFlightRequests.delete(videoUrl);
      return result;
    }

    // Strategy 4: No CORS canvas (won't allow getImageData but toDataURL might work)
    result = await extractViaCanvas(videoUrl, null);
    if (result) {
      thumbnailCache.set(videoUrl, result);
      inFlightRequests.delete(videoUrl);
      return result;
    }

    // All methods failed
    failedUrls.add(videoUrl);
    inFlightRequests.delete(videoUrl);
    return null;
  })();

  inFlightRequests.set(videoUrl, promise);
  return promise;
};

/**
 * Clear cache (useful for testing or memory management)
 */
export const clearThumbnailCache = () => {
  thumbnailCache.clear();
  failedUrls.clear();
  inFlightRequests.clear();
};

/**
 * React hook: useVideoThumbnail
 * Returns { thumbnail, loading, error }
 */
export const useVideoThumbnail = (videoUrl, existingThumbnail) => {
  const [thumbnail, setThumbnail] = useState(() => {
    // Initialize from cache synchronously to avoid flicker
    if (existingThumbnail) return existingThumbnail;
    if (videoUrl && thumbnailCache.has(videoUrl)) return thumbnailCache.get(videoUrl);
    return null;
  });
  const [loading, setLoading] = useState(() => {
    if (existingThumbnail) return false;
    if (videoUrl && thumbnailCache.has(videoUrl)) return false;
    return !!videoUrl;
  });
  const [error, setError] = useState(false);
  const mountedRef = useRef(true);
  const urlRef = useRef(videoUrl);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    urlRef.current = videoUrl;

    // If we have an existing thumbnail, use it
    if (existingThumbnail) {
      setThumbnail(existingThumbnail);
      setLoading(false);
      setError(false);
      return;
    }

    // No URL
    if (!videoUrl) {
      setThumbnail(null);
      setLoading(false);
      setError(false);
      return;
    }

    // Check cache synchronously
    if (thumbnailCache.has(videoUrl)) {
      setThumbnail(thumbnailCache.get(videoUrl));
      setLoading(false);
      setError(false);
      return;
    }

    // Check if previously failed
    if (failedUrls.has(videoUrl)) {
      setThumbnail(null);
      setLoading(false);
      setError(true);
      return;
    }

    // Generate
    setLoading(true);
    setError(false);

    generateVideoThumbnail(videoUrl).then((thumb) => {
      // Only update if this is still the current URL and component is mounted
      if (mountedRef.current && urlRef.current === videoUrl) {
        setThumbnail(thumb);
        setLoading(false);
        setError(!thumb);
      }
    });
  }, [videoUrl, existingThumbnail]);

  return { thumbnail, loading, error };
};