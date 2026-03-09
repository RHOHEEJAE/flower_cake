-- 회원가입 시 "Database error saving new user" 해결
-- Supabase 대시보드 > SQL Editor에서 이 스크립트를 실행하세요.
-- (반드시 프로젝트 소유자/postgres로 연결된 상태에서 실행)
--
-- 그래도 안 되면: 대시보드 > Logs > Postgres logs 에서
-- 회원가입 시점의 실제 DB 에러 메시지를 확인하세요.

-- 1) 기존 트리거용 정책 제거 (있을 수 있음)
DROP POLICY IF EXISTS "profiles_insert_auth_new_user" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_trigger" ON public.profiles;

-- 2) 트리거가 실행되는 역할이 profiles에 INSERT 할 수 있도록 허용
--    Supabase Cloud: 트리거는 supabase_auth_admin 역할로 실행됨
--    (역할이 없으면 에러 무시하고 3번 정책만 적용)
DO $$
BEGIN
  CREATE POLICY "profiles_insert_trigger" ON public.profiles
    FOR INSERT TO supabase_auth_admin
    WITH CHECK (true);
EXCEPTION
  WHEN OTHERS THEN NULL; -- 역할 없거나 정책 생성 실패 시 스킵, 3번 정책으로 시도
END $$;

-- 3) 대안 정책: auth.users에 존재하는 id만 INSERT 허용 (일부 환경에서 사용)
CREATE POLICY "profiles_insert_auth_new_user" ON public.profiles
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM auth.users u WHERE u.id = id));

-- 4) 함수: sign-up 폼의 name → nickname 반영, 소유자를 postgres로 설정해 권한 확보
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nickname, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'nickname',
      split_part(new.email, '@', 1)
    ),
    COALESCE(new.raw_user_meta_data ->> 'role', 'customer')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

-- 함수 소유자를 postgres로 (RLS 우회 가능하도록, 가능한 경우에만)
DO $$
BEGIN
  ALTER FUNCTION public.handle_new_user() OWNER TO postgres;
EXCEPTION
  WHEN insufficient_privilege THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

-- 5) 트리거 재생성 (이미 있으면 교체)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
