import { cookies } from 'next/headers'
import { createClient } from '@/app/lib/supabase/server'
import { normalizeLesson, type Lesson } from '@/app/models/LessonModel'

export async function getSupabaseLessons(): Promise<Lesson[]> {
  const supabase = createClient(await cookies())
  const { data, error } = await supabase
    .from('lessons')
    .select('id, lesson_id, grade_code, month_index, week_index, title, content')
    .order('month_index', { ascending: true })
    .order('week_index', { ascending: true })

  if (error) {
    console.error('Error fetching lessons:', error)
    return []
  }

  return (data ?? []).map((row) => normalizeLesson(row))
}

export async function getSupabaseLesson(id: string): Promise<Lesson | null> {
  const supabase = createClient(await cookies())
  const { data, error } = await supabase
    .from('lessons')
    .select('id, lesson_id, grade_code, month_index, week_index, title, content')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching lesson:', error)
    return null
  }

  if (!data) return null

  return normalizeLesson(data)
}

export async function createSupabaseLesson(lesson: {
  lesson_id: string
  grade_code: string
  month_index: number
  week_index: number
  title: string
  topic?: string
  tema?: string
  content: Record<string, unknown>
}) {
  const supabase = createClient(await cookies())
  const { data, error } = await supabase
    .from('lessons')
    .insert(lesson)
    .select()
    .single()

  if (error) {
    console.error('Error creating lesson:', error)
    return null
  }

  if (!data) return null

  return normalizeLesson(data)
}

export async function updateSupabaseLesson(
  id: string,
  updates: Record<string, unknown>
) {
  const supabase = createClient(await cookies())
  const { data, error } = await supabase
    .from('lessons')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating lesson:', error)
    return null
  }

  if (!data) return null

  return normalizeLesson(data)
}

export async function deleteSupabaseLesson(id: string) {
  const supabase = createClient(await cookies())
  const { error } = await supabase.from('lessons').delete().eq('id', id)

  if (error) {
    console.error('Error deleting lesson:', error)
    return false
  }

  return true
}
