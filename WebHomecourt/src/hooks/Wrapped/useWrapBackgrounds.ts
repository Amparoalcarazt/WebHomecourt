import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export type WrapBackground = {
  wrap_backgrounds_id: string
  label: string
  posterUrl: string
  displayOrder: number
}

export function useWrapBackgrounds() {
  const [backgrounds, setBackgrounds] = useState<WrapBackground[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBackgrounds() {
      try {
        const { data, error } = await supabase
          .from('wrap_backgrounds')
          .select('wrap_backgrounds_id, label, poster_url, display_order')
          .order('display_order', { ascending: true })

        if (error) throw error

        setBackgrounds(data.map(row => ({
          wrap_backgrounds_id: row.wrap_backgrounds_id,
          label: row.label,
          posterUrl: row.poster_url,
          displayOrder: row.display_order,
        })))
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBackgrounds()
  }, [])

  return { backgrounds, loading, error }
}

