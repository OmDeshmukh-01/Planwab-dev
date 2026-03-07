"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, useTransition } from "react";

export default function SearchModal({ externalOpen, onOpenChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (externalOpen) {
      setOpen(true);
      onOpenChange?.(false);
    }
  }, [externalOpen, onOpenChange]);

  // Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        e.stopPropagation();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed || isPending) return;

    startTransition(() => {
      router.push(`/vendors/marketplace?search=${encodeURIComponent(trimmed)}`);
    });

    // Close after a tiny delay so user sees the loader flash
    setTimeout(() => setOpen(false), 300);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[18vh] sm:pt-[20vh] bg-black/40 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => !isPending && setOpen(false)}
    >
      <div
        className="w-full max-w-xl mx-3 sm:mx-4 bg-white rounded-2xl shadow-[0_25px_60px_-12px_rgba(0,0,0,0.25)] border border-gray-200/80 overflow-hidden transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Row */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5">
          {/* Search icon or spinner */}
          {isPending ? (
            <svg
              className="w-5 h-5 text-blue-500 shrink-0 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-gray-400 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search venues, vendors, services..."
            disabled={isPending}
            className="flex-1 text-[15px] text-gray-800 placeholder-gray-400 outline-none bg-transparent disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          {/* Right side: clear button / submit button / ESC badge */}
          <div className="flex items-center gap-2 shrink-0">
            {query.trim() && !isPending && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                aria-label="Clear search"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {query.trim() && !isPending && (
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Search
              </button>
            )}

            {!query.trim() && (
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-[10px] font-medium text-gray-400 bg-gray-100/80 rounded-md border border-gray-200">
                ESC
              </kbd>
            )}
          </div>
        </div>

        {/* Loading bar */}
        {isPending && (
          <div className="h-0.5 w-full bg-gray-100 overflow-hidden">
            <div className="h-full w-2/3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full animate-pulse origin-left" />
          </div>
        )}

        {/* Bottom hint */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-gray-50/80 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-white rounded border border-gray-200 shadow-sm">
                ↵
              </kbd>
              to search
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-white rounded border border-gray-200 shadow-sm">
                esc
              </kbd>
              to close
            </span>
          </div>
          <span className="text-[11px] text-gray-300 font-medium tracking-wide">
            PlanWAB
          </span>
        </div>
      </div>
    </div>
  );
}