import type { SupabaseClient } from "@supabase/supabase-js"

/**
 * 호스티드 Supabase의 signInWithOAuth(kakao)는 서버가 항상 account_email 스코프를 넣어
 * 비즈앱이 아닐 때 KOE205가 납니다. 대신 `/auth/kakao/start`로 직접 인가합니다.
 * @see lib/auth/kakao-oauth.ts
 */
export function signInWithKakao(
  _supabase: SupabaseClient,
  nextPath: string = "/",
): Promise<{ data: { url: string } | null; error: Error | null }> {
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const startUrl = `${origin}/auth/kakao/start?next=${encodeURIComponent(nextPath)}`
  window.location.href = startUrl
  return Promise.resolve({ data: { url: startUrl }, error: null })
}
