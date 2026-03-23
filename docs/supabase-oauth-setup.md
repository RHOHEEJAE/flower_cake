# Supabase 카카오 로그인 설정

## 동작 방식 (이 레포)

호스티드 Supabase의 `signInWithOAuth({ provider: 'kakao' })`는 서버가 **`account_email` 스코프를 항상 붙여** 비즈앱이 아닐 때 **KOE205**가 날 수 있습니다.  
그래서 카카오 인가·토큰 교환은 **`/auth/kakao/start` → 카카오 → `/auth/kakao/callback`** 으로 직접 처리하고, **`signInWithIdToken`** 으로 세션을 만듭니다. (`lib/auth/kakao-oauth.ts` 참고)

## 1. 환경 변수 (Vercel / `.env.local`)

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — 기존과 동일
- `KAKAO_CLIENT_ID` — 카카오 **REST API 키**(앱 키와 동일)
- `KAKAO_CLIENT_SECRET` — 카카오 **카카오 로그인 Client Secret**(Supabase Kakao 프로바이더에 넣은 값과 동일 앱)

## 2. Supabase

**Authentication → Providers → Kakao** — **켜 두기**(id_token 검증에 동일 Client ID/Secret 필요).  
**Allow users without an email** — 이메일이 없을 수 있으면 켜기.

**Authentication → URL Configuration**

- **Site URL**, **Redirect URLs**에 앱 도메인·`/auth/callback` 등 기존과 같이 등록 (이메일/매직링크 등용).

## 3. 카카오 개발자 콘솔

1. **제품 설정 → 카카오 로그인** — 사용 ON  
2. **OpenID Connect** — **사용 설정 ON** (`id_token` 필요)  
3. **Redirect URI**에 아래를 **정확히** 등록 (배포 URL마다 추가):
   - `http://localhost:3000/auth/kakao/callback`
   - `https://(배포도메인)/auth/kakao/callback`  
   (Supabase 콜백 `…supabase.co/auth/v1/callback` 은 이 플로우에서 쓰지 않아도 됨.)
4. **동의항목**: `openid`, `닉네임(profile_nickname)`, `프로필 사진(profile_image)` 사용 가능하도록 설정

## 4. 프로필 트리거 (선택)

OAuth 사용자 이름이 비어 있지 않도록 `scripts/005_profile_oauth_metadata.sql`을 적용하면 `full_name`, `nickname` 등 메타데이터를 더 넓게 매핑합니다.
