import { useSearchParams } from 'react-router-dom'
import Nav from '../components/Nav'
import { useEffect, useState, useCallback } from "react"
import { getMatchups } from "../components/Brackets/getMatchups"
import type { Matchup } from "../components/Brackets/Brackets"
import MatchContainer from "../components/Brackets/MatchContainer"
import LastQuestion from "../components/Brackets/LastQuestion"
import type { Question } from "../components/Brackets/Brackets"
import {getQuestionById} from "../components/Brackets/getQuestionById"

function Brackets() {
  const [searchParams] = useSearchParams()
  const question_id = searchParams.get('question_id')
  const [question, setQuestion] = useState<Question | null> (null);
  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const q = await getQuestionById(question_id)
        setQuestion(q)
        
      } catch (error) {
        console.error("Error loading question:", error)
        setQuestion(null)
      }
    }
  loadQuestion()}, [question_id])
  
  const [matchups, setMatchups] = useState<Matchup[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const sortedMatchups = [...matchups].sort(
    (a, b) => a.round - b.round || a.position - b.position
  )
  const fetchMatchups = useCallback(async () => {
    setRefreshing(true)
    const data = await getMatchups(question_id)
    setMatchups(data)// actualiza datos
    setRefreshing(false)
  }, [question_id])

  useEffect(() => {
    fetchMatchups()
  }, [])
  {/* Agrupa por ronda y renderiza en columnas */}
const rounds = sortedMatchups.reduce<Record<number, Matchup[]>>((acc, m) => {
  acc[m.round] = [...(acc[m.round] ?? []), m]
  return acc
}, {})
const roundLabels: Record<number, string> = {
  1: 'Round of 16',
  2: 'Quarter finals',
  3: 'Semifinals',
  4: 'Final',
}


  return (
      <div className="flex flex-col items-center justify-center">
        <Nav current="Brackets" />
        <div className='px-4 md:px-14 py-5 bg-zinc-100 w-full flex flex-col gap-6'>
          <div className="w-full p-6 bg-[#3B195C] rounded-2xl shadow outline-black/25 inline-flex flex-col gap-3">
            <h1 className=" text-zinc-100">Fanvote Brackets</h1>
            <h5 className=" text-white">Help your favorites win by voting for them</h5>
          </div>
          <div className="bg-white rounded-2xl shadow outline-gray-500">
          {question && ( 
          <h1 className="text-[#3B195C] py-6 text-center justify-start"> {question.question_text}</h1>)}
            <div className={`flex flex-row gap-6 p-6 w-full overflow-x-auto transition-opacity ${refreshing ? 'opacity-60' : 'opacity-100'}`}>
              {Object.entries(rounds)
                .sort(([a], [b]) => +a - +b)
                .map(([roundNum, roundMatchups], ri) => (
                  <div key={roundNum} className="flex flex-col gap-2 min-w-[200px] w-full">

                    {/* nombre de ronda */}
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 text-center">
                      {roundLabels[+roundNum] ?? `Ronda ${roundNum}`}
                    </span>
                    {/* matchups */}
                    <div className="flex flex-col justify-around flex-1" style={{
                      gap: `${Math.pow(2, ri) * 1}rem`
                      }}>
                      {roundMatchups.map((m) => (
                        <MatchContainer key={m.matchup_id} {...m} refetch={fetchMatchups} />
                      ))}
                    </div>
                </div>
              ))}
          </div>
        </div>
        <LastQuestion/>
      </div>
    </div>
  )
}

export default Brackets
