# Supabase 카카오 로그인 설정

앱 코드는 `signInWithOAuth({ provider: 'kakao' })` 및 `/auth/callback` 라우트를 사용합니다. Supabase 프로젝트에서 아래를 설정해야 합니다.

## 1. Redirect URL

**Authentication → URL Configuration**

- **Site URL**: 로컬 개발 시 `http://localhost:3000`, 운영 시 실제 도메인 (예: Vercel)
- **Redirect URLs**에 다음을 추가:
  - `http://localhost:3000/auth/callback`
  - `https://(배포도메인)/auth/callback`

## 2. 카카오

**Authentication → Providers → Kakao** 활성화 후 [Kakao Developers](https://developers.kakao.com/)에서 앱을 만들고 REST API 키(Client ID)·Kakao Login Client Secret·Redirect URI를 Supabase 안내에 맞게 등록합니다.  
(Supabase 문서: [Kakao Login](https://supabase.com/docs/guides/auth/social-login/auth-kakao))

## 3. 프로필 트리거 (선택)

OAuth 사용자 이름이 비어 있지 않도록 `scripts/005_profile_oauth_metadata.sql`을 적용하면 `full_name`, `nickname` 등 메타데이터를 더 넓게 매핑합니다.
