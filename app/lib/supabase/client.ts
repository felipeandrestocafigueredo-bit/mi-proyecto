import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    if (typeof window !== 'undefined') {
      console.error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is undefined')
    }
    return null as unknown as ReturnType<typeof createBrowserClient>
  }
  return createBrowserClient(supabaseUrl, supabaseKey)
}
