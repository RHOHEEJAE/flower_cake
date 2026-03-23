import { exchangeKakaoCode } from "@/lib/auth/kakao-oauth"
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/**
 * 카카오가 돌려준 code → 토큰 → Supabase signInWithIdToken (account_email 미요청 플로우).
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  const searchParams = request.nextUrl.searchParams

  const kakaoError = searchParams.get("error")
  if (kakaoError) {
    const desc = searchParams.get("error_description") ?? kakaoError
    return NextResponse.redirect(
      `${origin}/auth/login?error=kakao&reason=${encodeURIComponent(desc)}`,
    )
  }

  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const cookieState = request.cookies.get("kakao_oauth_state")?.value
  const nextRaw = request.cookies.get("kakao_oauth_next")?.value
  const next = nextRaw ? decodeURIComponent(nextRaw) : "/"
  const safeNext = next.startsWith("/") ? next : "/"

  if (!code || !state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(`${origin}/auth/login?error=kakao&reason=invalid_state`)
  }

  const redirectUri = `${origin}/auth/kakao/callback`

  let tokenJson: Awaited<ReturnType<typeof exchangeKakaoCode>>
  try {
    tokenJson = await exchangeKakaoCode(code, redirectUri)
  } catch {
    return NextResponse.redirect(`${origin}/auth/login?error=kakao&reason=token_exchange`)
  }

  if (!tokenJson.id_token) {
    return NextResponse.redirect(`${origin}/auth/login?error=kakao&reason=no_id_token`)
  }

  const successRedirect = `${origin}${safeNext}`
  const response = NextResponse.redirect(successRedirect)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { error: signError } = await supabase.auth.signInWithIdToken({
    provider: "kakao",
    token: tokenJson.id_token,
    access_token: tokenJson.access_token,
  })

  if (signError) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=kakao&reason=${encodeURIComponent(signError.message)}`,
    )
  }

  response.cookies.delete("kakao_oauth_state")
  response.cookies.delete("kakao_oauth_next")

  return response
}
