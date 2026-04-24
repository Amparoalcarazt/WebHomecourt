import { supabase } from "../../lib/supabase"
import type { Matchup } from "./Brackets"

export async function getMatchups(questionId: number) {
  const usertest = "testuserid"
  const { data, error } = await supabase.rpc(
    "get_matchups_for_user",
    {
      p_user_id: usertest,
      p_question_id: questionId
    }
  )
  if (error) throw error

  return data
}