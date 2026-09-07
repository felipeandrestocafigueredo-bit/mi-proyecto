import { createClient } from '@/app/lib/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('*')

  return (
    <main style={{ padding: 30 }}>
      <h1>Prueba de Supabase</h1>

      {error ? (
        <pre>{JSON.stringify(error, null, 2)}</pre>
      ) : (
        <pre>{JSON.stringify(lessons, null, 2)}</pre>
      )}
    </main>
  )
}