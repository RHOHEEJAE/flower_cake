import type { SupabaseClient } from "@supabase/supabase-js"

/** Supabase 대시보드에서 Kakao 프로바이더 활성화 및 Redirect URL 등록 필요 */
export async function signInWithKakao(
  supabase: SupabaseClient,
  nextPath: string = "/",
) {
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`

  // KOE205(invalid_scope) 방지: account_email은 비즈앱 등에서만 설정 가능한 경우가 많아,
  // 닉네임·프로필 이미지만 요청. 카카오 콘솔 동의항목에도 아래 항목을 켜 두어야 함.
  return supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo,
      scopes: "profile_nickname profile_image",
    },
  })
}
