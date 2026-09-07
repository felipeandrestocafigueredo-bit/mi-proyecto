'use client'

import { createClient } from '@/app/lib/supabase/client'
import { useEffect, useState } from 'react'

type Lesson = {
  id: string
  month_index: number
  week_index: number
  title: string
  content: Record<string, unknown>
}

export default function SupabaseLessonsList() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('lessons')
        .select('*')
        .order('month_index', { ascending: true })
        .order('week_index', { ascending: true })

      setLessons(data || [])
      setLoading(false)
    }

    load()
  }, [])

  if (loading) return <p>Cargando lecciones...</p>

  return (
    <div>
      {lessons.map((lesson) => (
        <div key={lesson.id}>
          <h3>{lesson.title}</h3>
          <p>Mes: {lesson.month_index}, Semana: {lesson.week_index}</p>
        </div>
      ))}
    </div>
  )
}
