// services/vote.ts
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../hooks/Perfil/useAuth"

export async function submitVote(matchupId: number, selectedId: number) {
  const  userId  = "testuserid"

  if (!userId) throw new Error("Not authenticated")

  const { error } = await supabase
    .from("user_vote")
    .insert({
      user_id: userId,
      matchup_id: matchupId,
      selected_id: selectedId
    })

  if (error) throw error
}