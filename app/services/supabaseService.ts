import { cookies } from 'next/headers'
import { createClient } from '@/app/lib/supabase/server'
import { normalizeLesson, type Lesson } from '@/app/models/LessonModel'

export async function getSupabaseLessons(): Promise<Lesson[]> {
  const supabase = createClient(await cookies())
  console.log('[supabaseService] getSupabaseLessons:start', { hasClient: Boolean(supabase) })
  const { data, error } = await supabase
    .from('lessons')
    .select('id, lesson_id, grade_code, month_index, week_index, title, content')
    .order('month_index', { ascending: true })
    .order('week_index', { ascending: true })

  if (error) {
    console.error('[supabaseService] getSupabaseLessons:error', { error: error.message, name: error.name })
    return []
  }

  const lessons = (data ?? []).map((row) => normalizeLesson(row))
  console.log('[supabaseService] getSupabaseLessons:ok', { count: lessons.length })
  return lessons
}

export async function getSupabaseLesson(id: string): Promise<Lesson | null> {
  const supabase = createClient(await cookies())
  console.log('[supabaseService] getSupabaseLesson:start', { id })
  const { data, error } = await supabase
    .from('lessons')
    .select('id, lesson_id, grade_code, month_index, week_index, title, content')
    .eq('id', id)
    .single()

  if (error) {
    console.error('[supabaseService] getSupabaseLesson:error', { id, error: error.message, name: error.name })
    return null
  }

  if (!data) {
    console.log('[supabaseService] getSupabaseLesson:empty', { id })
    return null
  }

  const lesson = normalizeLesson(data)
  console.log('[supabaseService] getSupabaseLesson:ok', { id, lessonId: lesson.lesson_id })
  return lesson
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
  console.log('[supabaseService] createSupabaseLesson:start', { lesson_id: lesson.lesson_id })
  const { data, error } = await supabase
    .from('lessons')
    .insert(lesson)
    .select()
    .single()

  if (error) {
    console.error('[supabaseService] createSupabaseLesson:error', { error: error.message, name: error.name })
    return null
  }

  if (!data) {
    console.log('[supabaseService] createSupabaseLesson:empty', { lesson_id: lesson.lesson_id })
    return null
  }

  const normalized = normalizeLesson(data)
  console.log('[supabaseService] createSupabaseLesson:ok', { lesson_id: normalized.lesson_id })
  return normalized
}

export async function updateSupabaseLesson(
  id: string,
  updates: Record<string, unknown>
) {
  const supabase = createClient(await cookies())
  console.log('[supabaseService] updateSupabaseLesson:start', { id, updatesKeys: Object.keys(updates) })
  const { data, error } = await supabase
    .from('lessons')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[supabaseService] updateSupabaseLesson:error', { id, error: error.message, name: error.name })
    return null
  }

  if (!data) {
    console.log('[supabaseService] updateSupabaseLesson:empty', { id })
    return null
  }

  const normalized = normalizeLesson(data)
  console.log('[supabaseService] updateSupabaseLesson:ok', { id, lessonId: normalized.lesson_id })
  return normalized
}

export async function deleteSupabaseLesson(id: string) {
  const supabase = createClient(await cookies())
  console.log('[supabaseService] deleteSupabaseLesson:start', { id })
  const { error } = await supabase.from('lessons').delete().eq('id', id)

  if (error) {
    console.error('[supabaseService] deleteSupabaseLesson:error', { id, error: error.message, name: error.name })
    return false
  }

  console.log('[supabaseService] deleteSupabaseLesson:ok', { id })
  return true
}
