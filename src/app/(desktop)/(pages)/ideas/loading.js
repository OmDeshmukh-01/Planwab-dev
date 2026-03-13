export default function IdeasDesktopLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex">
      {/* Sidebar skeleton */}
      <aside className="w-[280px] bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 shrink-0 fixed h-full">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="flex-1 space-y-1.5">
              <div className="h-5 w-28 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
          </div>
        </div>
        <div className="p-4 space-y-1 animate-pulse">
          <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded mb-3 ml-2" />
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800" />
              <div className={`h-4 rounded bg-gray-100 dark:bg-gray-800 ${i % 3 === 0 ? "w-20" : i % 3 === 1 ? "w-24" : "w-16"}`} />
            </div>
          ))}
        </div>
      </aside>

      {/* Main content skeleton */}
      <main className="ml-[280px] flex-1 animate-pulse">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between max-w-[1400px] mx-auto">
            <div className="flex items-center gap-2">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-4 w-4 bg-gray-100 dark:bg-gray-800 rounded" />
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-64 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl" />
              <div className="w-24 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="px-8 py-8 max-w-[1400px] mx-auto">
          {/* Title */}
          <div className="mb-10 space-y-2">
            <div className="h-10 w-72 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            <div className="h-5 w-96 bg-gray-100 dark:bg-gray-800 rounded-lg" />
          </div>

          {/* Category grid */}
          <div className="mb-12">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-5" />
            <div className="grid grid-cols-4 xl:grid-cols-6 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-800" />
                  <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel skeletons */}
          {[1, 2, 3].map((section) => (
            <div key={section} className="mb-10">
              <div className="flex items-end justify-between mb-5">
                <div className="space-y-1.5">
                  <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                  <div className="h-3 w-32 bg-gray-100 dark:bg-gray-800 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
              <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="w-[185px] shrink-0">
                    <div className="aspect-[9/16] rounded-2xl overflow-hidden relative bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                      <div
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 1.5s infinite",
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1.5">
                        <div className="h-4 w-4/5 bg-gray-300/30 dark:bg-gray-700/30 rounded" />
                        <div className="h-3 w-2/3 bg-gray-300/20 dark:bg-gray-700/20 rounded" />
                        <div className="flex justify-between mt-1">
                          <div className="h-3 w-14 bg-gray-300/20 dark:bg-gray-700/20 rounded" />
                          <div className="h-3 w-12 bg-gray-300/20 dark:bg-gray-700/20 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Trending CTA skeleton */}
          <div className="mt-10 mb-4">
            <div className="h-[76px] rounded-2xl bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900" />
          </div>
        </div>
      </main>
    </div>
  );
}