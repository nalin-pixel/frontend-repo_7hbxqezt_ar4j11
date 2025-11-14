import React from 'react'
import useFetch from './hooks/useFetch'

function App() {
  const {
    data: products,
    loading,
    error,
    refetch,
  } = useFetch('https://api.escuelajs.co/api/v1/products?offset=0&limit=24')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">React Custom Hook: useFetch</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={refetch}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Reload
            </button>
            <a
              href="/test"
              className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition-colors"
            >
              Backend Test
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <p className="text-gray-600 mb-6">
          This page demonstrates a reusable data fetching hook. It handles loading and error states and returns data, loading, error, and a refetch function.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            <p className="font-semibold">Failed to load products</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl shadow p-4">
                <div className="h-40 bg-gray-200 rounded-lg" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mt-4" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
              </div>
            ))}
          </div>
        )}

        {!loading && products && Array.isArray(products) && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Products</h2>
              <p className="text-sm text-gray-500">Showing {products.length} items</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <article
                  key={p.id}
                  className="bg-white rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                >
                  <div className="aspect-[4/3] bg-gray-100">
                    {p?.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-800 line-clamp-2">{p.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {p.description || 'No description available.'}
                    </p>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <span className="text-blue-600 font-semibold">${p.price}</span>
                      <span className="text-xs text-gray-500">#{p.id}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
