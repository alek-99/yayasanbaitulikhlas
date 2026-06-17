export default function LoadingDetailArtikel() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased animate-pulse pb-20">
      {/* Topbar Skeleton */}
      <div className="h-16 border-b border-gray-100 bg-gray-50/50 w-full mb-6 sm:mb-10" />

      <main className="container mx-auto px-4 max-w-3xl">
        <div className="space-y-6">
          {/* Metadata Skeleton */}
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="h-3.5 bg-gray-200 rounded w-32" />
              <div className="h-3.5 bg-gray-200 rounded w-4" />
              <div className="h-3.5 bg-gray-200 rounded w-24" />
            </div>

            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-7 sm:h-9 lg:h-10 bg-gray-200 rounded-lg w-full" />
              <div className="h-7 sm:h-9 lg:h-10 bg-gray-200 rounded-lg w-5/6" />
            </div>
          </div>

          {/* Banner Gambar Skeleton (16:9 Aspect Ratio) */}
          <div className="relative aspect-[16/9] w-full rounded-2xl bg-gray-200 border border-gray-100" />

          {/* Isi Konten Skeleton */}
          <div className="pt-4 border-t border-gray-100">
            <div className="border-l-4 border-gray-200 pl-4 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-11/12" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-10/12" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>

        {/* Footer Card Skeleton */}
        <footer className="mt-12 pt-8 border-t border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center sm:items-start space-y-3 w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="h-4 bg-gray-200 rounded w-36" />
              </div>
              <div className="h-3 bg-gray-200 rounded w-52 sm:w-64" />
            </div>
            <div className="w-full sm:w-32 h-9 bg-gray-200 rounded-xl" />
          </div>
        </footer>
      </main>
    </div>
  );
}