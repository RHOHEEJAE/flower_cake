-- 회원가입 시 "Database error saving new user" 해결
-- Supabase 대시보드 > SQL Editor에서 이 스크립트를 실행하세요.

-- 1) 트리거가 프로필 INSERT 할 수 있도록 RLS 정책 추가
--    (auth.users에 있는 id만 허용 → 트리거 실행 역할만 통과)
DROP POLICY IF EXISTS "profiles_insert_auth_new_user" ON public.profiles;
CREATE POLICY "profiles_insert_auth_new_user" ON public.profiles
  FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM auth.users u WHERE u.id = id));

-- 2) 트리거: sign-up 폼의 name → nickname 반영
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
