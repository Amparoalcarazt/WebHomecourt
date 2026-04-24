export interface Question {
  question_id: number
  question_text: string
  start_date: string
  end_date: string
}

export type Answer={
    question_id: number,
    anwser_text: string
}

export type Matchup = {
  matchup_id: number
  round: number
  matchup_position: number
  winner_id: number | null
  answer_a_id: number
  answer_a_text: string
  answer_b_id: number
  answer_b_text: string
  percent_a: number
  percent_b: number
  active: boolean
  voted: boolean
}