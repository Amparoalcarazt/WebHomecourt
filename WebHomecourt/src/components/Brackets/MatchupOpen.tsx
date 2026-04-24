// components/MatchupOpen.tsx
import { useState } from "react"
import type { Matchup } from "./Brackets"
import { submitVote } from "./insertVote"

type Props = {
  match: Matchup
  refetch:()=> void
}

export default function MatchupOpen({ match, refetch }: Props) {
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)

  async function handleVote(answerId: number) {
    try {
      setLoading(true)
      setSelected(answerId)
      await submitVote(match.matchup_id, answerId)
      await refetch() 
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex flex-col gap-2 p-4 border-gray-500 bg-white rounded-xl shadow">

      <button
        onClick={() => handleVote(match.answer_a_id)}
        disabled={loading}
        className={`p-2 px-4 rounded-xl w-full ${
          selected === match.answer_a_id
            ? "bg-[#9482A5]"
            : "bg-gray-300 hover:bg-[#9482A5] "
        }`}
      >
        <span>{match.answer_a_text}</span>
      </button>

      <button
        onClick={() => handleVote(match.answer_b_id)}
        className={`p-2 px-4 rounded-xl w-full ${
          selected === match.answer_b_id
           ? "bg-[#9482A5]"
            : "bg-gray-300 hover:bg-[#9482A5] "
        }`}
      >
        {match.answer_b_text}
      </button>
    </div>
  )
}