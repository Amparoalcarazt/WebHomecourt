import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export interface MVPMoment {
  playerName: string
  points: number
  assists: number
  rebounds: number
  photoUrl: string | null
}

export function useMVPMoment() {
  const [mvp, setMvp] = useState<MVPMoment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMVP() {
      try {
        // 1. trae el ultimo juego
        const { data: gameData, error: gameError } = await supabase
          .schema('simulacion_juego')
          .from('game')
          .select('game_id')
          .not('game_end_time', 'is', null) 
          .order('start_date', { ascending: false })
          .limit(1)
          .single()

        if (gameError) throw gameError

        // 2. trae stats de jugadores lakers en ese juego
        const { data: statsData, error: statsError } = await supabase
          .schema('simulacion_juego')
          .from('team_player_stats')
          .select('points, assists, rebounds, team_player(first_name, last_name, team_id, photo_url)')
          .eq('game_id', gameData.game_id)

        if (statsError) throw statsError

        // 3. filtra solo Lakers y encuentra el de mas puntos
        const lakersStats = statsData.filter(
          (s: any) => s.team_player?.team_id === 1
        )

        if (lakersStats.length === 0) throw new Error('No Lakers stats found')

        const mvpStat = lakersStats.reduce((best: any, s: any) =>
          (s.points || 0) > (best.points || 0) ? s : best
        )

        // team_player puede ser un objeto o un array
        const player = Array.isArray(mvpStat.team_player) ? mvpStat.team_player[0] : mvpStat.team_player

        setMvp({
          playerName: `${player.first_name} ${player.last_name}`,
          points: mvpStat.points || 0,
          assists: mvpStat.assists || 0,
          rebounds: mvpStat.rebounds || 0,
          photoUrl: player.photo_url ?? null,
        })
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMVP()
  }, [])

  return { mvp, loading, error }
}