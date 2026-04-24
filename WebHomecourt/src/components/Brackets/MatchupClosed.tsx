import type { Matchup } from "./Brackets"
function MatchupClosed({match}:{match: Matchup}) {
  match.winner_id
  return(
    <div className="flex flex-col gap-2 p-4 border-gray-500 bg-white rounded-xl shadow">
      <div>
        <div className="space-y-2">
          <div className={`p-2 px-4 rounded-xl flex justify-between ${
            (match.answer_a_id === match.winner_id) ? "bg-[#3B195C] text-white" : 
            (match.answer_a_id === match.voted) ? "bg-[#9482A5]" : "bg-gray-300"}`}>
            <span>{match.answer_a_text}</span>
            <span>{match.percent_a}%</span>
          </div>
          <div className={`p-2 px-4 rounded-xl flex justify-between ${
            (match.answer_b_id === match.winner_id) ? "bg-[#3B195C] text-white" : 
            (match.answer_b_id === match.voted) ? "bg-[#9482A5]" : "bg-gray-300"}`}>
            <span>{match.answer_b_text}</span>
            <span>{match.percent_b}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default MatchupClosed