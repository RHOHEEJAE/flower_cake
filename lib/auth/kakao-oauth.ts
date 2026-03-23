/**
 * 호스티드 Supabase(GoTrue)는 카카오 인가에 account_email을 항상 넣어 비즈앱이 아닐 때 KOE205가 납니다.
 * 인가 URL·토큰 교환을 직접 하고 id_token으로 signInWithIdToken 하는 경로용 유틸입니다.
 * @see https://github.com/supabase/auth/blob/master/internal/api/provider/kakao.go
 */

/** account_email 제외: OIDC id_token + 프로필 (Supabase signInWithIdToken 용) */
export const KAKAO_OAUTH_SCOPES = "openid profile_nickname profile_image"

export type KakaoTokenResponse = {
  access_token?: string
  id_token?: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
}

export function getKakaoClientId(): string {
  const id = process.env.KAKAO_CLIENT_ID ?? process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
  if (!id) {
    throw new Error("KAKAO_CLIENT_ID (또는 NEXT_PUBLIC_KAKAO_CLIENT_ID)가 설정되지 않았습니다.")
  }
  return id
}

export function getKakaoAuthorizeUrl(redirectUri: string, state: string): string {
  const clientId = getKakaoClientId()
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: KAKAO_OAUTH_SCOPES,
    state,
  })
  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`
}

export async function exchangeKakaoCode(
  code: string,
  redirectUri: string,
): Promise<KakaoTokenResponse> {
  const clientId = getKakaoClientId()
  const secret = process.env.KAKAO_CLIENT_SECRET
  if (!secret) {
    throw new Error("KAKAO_CLIENT_SECRET이 설정되지 않았습니다.")
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: redirectUri,
    code,
    client_secret: secret,
  })

  const res = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: body.toString(),
  })

  const json = (await res.json()) as KakaoTokenResponse & { error?: string; error_description?: string }

  if (!res.ok) {
    const msg = json.error_description ?? json.error ?? res.statusText
    throw new Error(msg)
  }

  return json
}
