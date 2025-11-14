import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * useFetch - A reusable data fetching hook
 *
 * @param {string} url - The endpoint to fetch
 * @param {RequestInit} [options] - Optional fetch options
 * @returns {{ data: any, loading: boolean, error: Error | null, refetch: () => Promise<void> }}
 */
export default function useFetch(url, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(Boolean(url))
  const [error, setError] = useState(null)

  const abortCtrlRef = useRef(null)
  const urlRef = useRef(url)
  const optsRef = useRef(options)

  const fetchData = useCallback(async () => {
    if (!urlRef.current) return
    setLoading(true)
    setError(null)

    // Abort any in-flight request before starting a new one
    if (abortCtrlRef.current) {
      abortCtrlRef.current.abort()
    }
    const controller = new AbortController()
    abortCtrlRef.current = controller

    try {
      const res = await fetch(urlRef.current, {
        ...optsRef.current,
        signal: controller.signal,
      })

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`)
      }

      const contentType = res.headers.get('content-type') || ''
      const isJson = contentType.includes('application/json')
      const body = isJson ? await res.json() : await res.text()

      setData(body)
    } catch (err) {
      if (err.name === 'AbortError') return
      setError(err)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Trigger fetch on mount and whenever url/options change
  useEffect(() => {
    urlRef.current = url
    optsRef.current = options
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(options)])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortCtrlRef.current) abortCtrlRef.current.abort()
    }
  }, [])

  const refetch = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}
