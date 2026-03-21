import type { SupabaseClient } from "@supabase/supabase-js"

/** Supabase 대시보드에서 Kakao 프로바이더 활성화 및 Redirect URL 등록 필요 */
export async function signInWithKakao(
  supabase: SupabaseClient,
  nextPath: string = "/",
) {
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`

  return supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo,
    },
  })
}
