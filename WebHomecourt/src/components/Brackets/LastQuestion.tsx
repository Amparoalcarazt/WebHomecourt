import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {Question} from "../Brackets/Brackets"


export async function getLastQuestion(): Promise<Question> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('question')
    .select('*')
    .lt('end_date', now) 
    .order('end_date', { ascending: false })
    .single()
  if (error) {
    console.error("Supabase error:", error.message);
    throw new Error("Failed to get previous bracket");
  }
  return data;
}

function LastQuestion(){
    const [question, setQuestion] = useState<Question | null> (null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadQuestion = async () => {
            try {
                const data = await getLastQuestion();
                setQuestion(data);
            } catch (err) {
                console.error(err)
        } finally {
          setIsLoading(false)
            }
        }
        loadQuestion();
    },[]);

    if (isLoading) return null;

    return(
    <div className="bg-white p-6 rounded-2xl shadow outline-gray-500">
        <h1 className="self-stretch text-center justify-start text-[#3B195C] text-2xl p-2 md:text-3xl ">Last Week: {question?.question_text}</h1>
        <h2 className="self-stretch text-center justify-start text-[#3B195C] text-2xl p-2 md:text-3xl ">Winner: {question?.winner}</h2>
    </div>
    )
}

export default LastQuestion;