'use server'

import { getSupabaseLessons, createSupabaseLesson } from '@/app/services/supabaseService'
import { type Lesson } from '@/app/models/LessonModel'

export async function getServerLessons(): Promise<Lesson[]> {
  return getSupabaseLessons()
}

export async function addServerLesson(formData: FormData) {
  const lesson_id = String(formData.get('lesson_id') ?? '')
  const grade_code = String(formData.get('grade_code') ?? '')
  const monthIndex = parseInt(formData.get('monthIndex') as string)
  const weekIndex = parseInt(formData.get('weekIndex') as string)
  const title = String(formData.get('title') ?? '')
  const contentRaw = formData.get('content')
  const content = typeof contentRaw === 'string' ? JSON.parse(contentRaw) : {}

  if (!lesson_id || !grade_code || Number.isNaN(monthIndex) || Number.isNaN(weekIndex) || !title) {
    return null
  }

  return createSupabaseLesson({
    lesson_id,
    grade_code,
    month_index: monthIndex,
    week_index: weekIndex,
    title,
    content,
  })
}
