import { getKakaoAuthorizeUrl, getKakaoClientId } from "@/lib/auth/kakao-oauth"
import { NextResponse, type NextRequest } from "next/server"

/**
 * 카카오 인가 화면으로 리다이렉트 (account_email 스코프 없음).
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  const nextParam = request.nextUrl.searchParams.get("next")
  const next = nextParam?.startsWith("/") ? nextParam : "/"

  try {
    getKakaoClientId()
  } catch {
    return NextResponse.redirect(`${origin}/auth/login?error=kakao&reason=missing_env`)
  }

  const state = crypto.randomUUID()
  const redirectUri = `${origin}/auth/kakao/callback`
  const url = getKakaoAuthorizeUrl(redirectUri, state)

  const response = NextResponse.redirect(url)
  response.cookies.set("kakao_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  })
  response.cookies.set("kakao_oauth_next", encodeURIComponent(next), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  })
  return response
}
