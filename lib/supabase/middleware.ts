import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 일반 고객 보호 경로 (비로그인 → /auth/login)
  const clientProtected = ['/mypage', '/checkout', '/cart']
  if (clientProtected.some((p) => pathname.startsWith(p)) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // 관리자 경로 (비로그인 → /admin-login)
  // /admin-login 자체는 보호하지 않음
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin-login') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin-login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
