import { supabase } from "@/lib/supabase/client";

export type StudyRecord = {
  id: string;
  user_id: string;
  subject: string;
  topic: string;
  study_date: string;
  created_at: string;
};

export type RevisionRecord = {
  id: string;
  study_id: string;
  revision_date: string;
  revision_number: number;
  is_completed: boolean;
  study?: StudyRecord;
};

// Algoritmo da curva do esquecimento (em dias a partir da data de estudo original)
const SPACING_INTERVALS = [1, 3, 7, 15, 30];

// Ajusta a data lidando com fuso horário local e retorna YYYY-MM-DD
function addDaysToDateString(dateString: string, days: number): string {
  // Parsing a string date as local time (YYYY-MM-DDT00:00:00)
  const d = new Date(dateString + "T00:00:00");
  d.setDate(d.getDate() + days);
  
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  
  return `${yyyy}-${mm}-${dd}`;
}

export async function createStudy(subject: string, topic: string, studyDateString: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData?.user) {
    throw new Error("Você precisa estar logado para cadastrar um estudo.");
  }

  // 1. Inserir a matéria (Study)
  const { data: study, error: studyError } = await supabase
    .from("studies")
    .insert([
      {
        user_id: userData.user.id,
        subject,
        topic,
        study_date: studyDateString,
      },
    ])
    .select()
    .single();

  if (studyError) throw new Error("Erro ao criar o estudo: " + studyError.message);

  // 2. Calcular datas de Revisão baseadas nos intervalos de repetição espaçada
  const revisionsToInsert = SPACING_INTERVALS.map((daysInterval, index) => ({
    study_id: (study as StudyRecord).id,
    revision_date: addDaysToDateString(studyDateString, daysInterval),
    revision_number: index + 1,
    is_completed: false,
  }));

  // 3. Inserir Registros de Revisão (Revisions)
  const { error: revError } = await supabase
    .from("revisions")
    .insert(revisionsToInsert);
  
  if (revError) {
    // Ideally we would rollback the standard study insert here if Supabase doesn't have RPC
    throw new Error("Erro ao criar as datas de revisão: " + revError.message);
  }

  return study;
}

export async function getStudies() {
  const { data, error } = await supabase
    .from("studies")
    .select("*")
    .order("study_date", { ascending: false });
    
  if (error) throw new Error(error.message);
  return data as StudyRecord[];
}

export async function getPendingRevisions(targetDateStr: string) {
  const { data, error } = await supabase
    .from("revisions")
    .select(`
      *,
      study:studies (*)
    `)
    .eq("revision_date", targetDateStr)
    .eq("is_completed", false)
    .order("revision_number", { ascending: true });
    
  if (error) throw new Error(error.message);
  return data as RevisionRecord[];
}

export async function getMonthRevisions(startDateStr: string, endDateStr: string) {
  const { data, error } = await supabase
    .from("revisions")
    .select(`
      *,
      study:studies (*)
    `)
    .gte("revision_date", startDateStr)
    .lte("revision_date", endDateStr)
    .order("revision_date", { ascending: true })
    .order("revision_number", { ascending: true });
    
  if (error) throw new Error(error.message);
  return data as RevisionRecord[];
}

export async function markRevisionCompleted(revisionId: string, completed: boolean = true) {
  const { error } = await supabase
    .from("revisions")
    .update({ is_completed: completed })
    .eq("id", revisionId);
    
  if (error) throw new Error(error.message);
}
