import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const updateLastSeen = async (userId: string) => {
    await supabase
      .from("user_laker")
      .update({ last_seen: new Date().toISOString() })
      .eq("user_id", userId)
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
      if (user) updateLastSeen(user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (session?.user) updateLastSeen(session.user.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, userId: user?.id ?? null, loading }
}