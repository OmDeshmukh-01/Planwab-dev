export default function IdeasLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black animate-pulse">
      {/* Header skeleton */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="flex-1 space-y-1.5">
            <div className="h-5 w-36 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Subtype grid skeleton — 2 rows */}
        <div className="px-4 py-3">
          <div className="grid grid-rows-2 grid-flow-col auto-cols-max gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-[82px] h-[82px] rounded-2xl bg-gray-100 dark:bg-gray-800"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Carousel skeletons */}
      <div className="pt-6 space-y-8">
        {[1, 2, 3].map((section) => (
          <div key={section}>
            {/* Section title */}
            <div className="px-4 mb-3 flex items-center justify-between">
              <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              <div className="flex gap-1.5">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>

            {/* Cards row */}
            <div className="flex gap-3 px-4 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[150px] shrink-0"
                >
                  <div className="aspect-[9/16] rounded-2xl bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                    {/* Shimmer effect */}
                    <div className="w-full h-full relative">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-[shimmer_1.5s_infinite]"
                        style={{
                          backgroundSize: "200% 100%",
                          animation: `shimmer 1.5s infinite`,
                        }}
                      />
                      {/* Bottom content placeholder */}
                      <div className="absolute bottom-0 left-0 right-0 p-2.5 space-y-1.5">
                        <div className="h-3.5 w-4/5 bg-gray-300/40 dark:bg-gray-700/40 rounded" />
                        <div className="h-2.5 w-2/3 bg-gray-300/30 dark:bg-gray-700/30 rounded" />
                        <div className="flex justify-between mt-1">
                          <div className="h-2.5 w-12 bg-gray-300/30 dark:bg-gray-700/30 rounded" />
                          <div className="h-2.5 w-10 bg-gray-300/30 dark:bg-gray-700/30 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Trending banner skeleton */}
        <div className="px-4 pt-2 pb-4">
          <div className="h-20 rounded-2xl bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900" />
        </div>
      </div>
    </div>
  );
}