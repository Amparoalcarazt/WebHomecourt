import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export interface LastGame {
  gameId: number
  date: string
  venue: string
  won: boolean
  lakersScore: number
  opponentScore: number
  opponentName: string
  opponentAbbr: string
  opponentLogoUrl: string | null
  lakersLogoUrl: string | null
  lakersAbbr: string
  lakersName: string
}

export function useLastGame() {
  const [lastGame, setLastGame] = useState<LastGame | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLastGame() {
      try {
        // 1. trae el ultimo juego
        const { data: gameData, error: gameError } = await supabase
          .schema('simulacion_juego')
          .from('game')
          .select('game_id, venue, start_date, won, opposing_team_id')
          .not('game_end_time', 'is', null)
          .order('start_date', { ascending: false })
          .limit(1)
          .single()
        console.log('game fetched:', gameData)
        console.log('game error:', gameError)

        if (gameError) throw gameError

        // 2. trae el equipo rival
        const { data: teamData, error: teamError } = await supabase
          .schema('simulacion_juego')
          .from('team')
          .select('team_name, abreviatura, logo_url')
          .eq('team_id', gameData.opposing_team_id)
          .single()

        if (teamError) throw teamError

        // 2b. trae el logo de lakers
        const { data: lakersTeam } = await supabase
          .schema('simulacion_juego')
          .from('team')
          .select('logo_url, abreviatura, team_name')
          .eq('team_id', 1)
          .single()

        // 3. trae stats de todos los jugadores en ese juego
        const { data: statsData, error: statsError } = await supabase
          .schema('simulacion_juego')
          .from('team_player_stats')
          .select('points, team_player_id, team_player(team_id)')
          .eq('game_id', gameData.game_id)

        if (statsError) throw statsError

        // 4. calcula scores sumando puntos por equipo
        const lakersScore = statsData
          .filter((s: any) => s.team_player?.team_id === 1)
          .reduce((sum: number, s: any) => sum + (s.points || 0), 0)

        const opponentScore = statsData
          .filter((s: any) => s.team_player?.team_id !== 1)
          .reduce((sum: number, s: any) => sum + (s.points || 0), 0)

        setLastGame({
          gameId: gameData.game_id,
          date: new Date(gameData.start_date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          }),
          venue: gameData.venue,
          won: gameData.won,
          lakersScore,
          opponentScore,
          opponentName: teamData.team_name,
          opponentAbbr: teamData.abreviatura || teamData.team_name.substring(0, 3).toUpperCase(),
          opponentLogoUrl: teamData.logo_url ?? null,
          lakersLogoUrl: lakersTeam?.logo_url ?? null,
          lakersAbbr: lakersTeam?.abreviatura || 'LAL',
          lakersName: lakersTeam?.team_name || 'Los Angeles Lakers',
        })
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchLastGame()
  }, [])

  return { lastGame, loading, error }
}