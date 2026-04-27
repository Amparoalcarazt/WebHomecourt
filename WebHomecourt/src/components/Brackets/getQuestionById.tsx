import type {Question} from '../Home/Brackets'
import { supabase } from "../../lib/supabase"

export async function getQuestionById(question_id: number): Promise<Question>{
    const {data, error} = await supabase  
        .from("question")
        .select("*")
        .eq("question_id", question_id)
        .single();
    if (error) {
        console.error("Supabase error:", error.message)
        throw new Error("Failed to get Question")
    }
    return data
}
