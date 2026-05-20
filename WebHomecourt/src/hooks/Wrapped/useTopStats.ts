import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export interface TopStat {
  label: string
  value: string
}

export function useTopStats() {
  const [topStats, setTopStats] = useState<TopStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTopStats() {
      try {
        // 1. trae el ultimo juego terminado
        const { data: gameData, error: gameError } = await supabase
          .schema('simulacion_juego')
          .from('game')
          .select('game_id')
          .not('game_end_time', 'is', null) 
          .order('start_date', { ascending: false })
          .limit(1)
          .single()

        if (gameError) throw gameError

        // 2. trae stats + nombres de jugadores lakers
        const { data: statsData, error: statsError } = await supabase
          .schema('simulacion_juego')
          .from('team_player_stats')
          .select('points, assists, rebounds, team_player(team_id, first_name, last_name)')
          .eq('game_id', gameData.game_id)

        if (statsError) throw statsError

        const lakersStats = statsData.filter(
          (s: any) => s.team_player?.team_id === 1
        )

        if (lakersStats.length === 0) throw new Error('No Lakers stats found')

        // 3. calcula las 4 stats
        const teamScore = lakersStats.reduce(
          (sum: number, s: any) => sum + (s.points || 0), 0
        )

        const topScorer = lakersStats.reduce((best: any, s: any) =>
          (s.points || 0) > (best.points || 0) ? s : best, lakersStats[0]
        )

        const topAssists = lakersStats.reduce((best: any, s: any) =>
          (s.assists || 0) > (best.assists || 0) ? s : best, lakersStats[0]
        )

        const topRebounds = lakersStats.reduce((best: any, s: any) =>
          (s.rebounds || 0) > (best.rebounds || 0) ? s : best, lakersStats[0]
        )

        // helper para abreviar nombre: "lebron james" → "l. james"
        const abbrevName = (s: any) =>
          `${s.team_player.first_name[0]}. ${s.team_player.last_name}`

        setTopStats([
          { label: 'Team Score', value: `${teamScore} PTS` },
          { label: 'Top Scorer', value: `${abbrevName(topScorer)} · ${topScorer?.points || 0} PTS` },
          { label: 'Top Assists', value: `${abbrevName(topAssists)} · ${topAssists?.assists || 0} AST` },
          { label: 'Top Rebounds', value: `${abbrevName(topRebounds)} · ${topRebounds?.rebounds || 0} REB` },
        ])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTopStats()
  }, [])

  return { topStats, loading, error }
}