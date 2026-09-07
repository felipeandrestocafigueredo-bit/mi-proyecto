import { createClient } from './app/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

// Next.js 16 deprecated middleware.ts in favor of proxy.ts.
// See: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
// This file handles Supabase SSR cookie refresh for server actions.

export async function proxy(request: NextRequest) {
  try {
    const response = await createClient(request)
    return response
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.next({ request })
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
