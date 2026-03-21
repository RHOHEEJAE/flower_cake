-- OAuth(카카오·네이버 등) 가입 시 표시 이름 메타데이터 확장
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
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'nickname',
      new.raw_user_meta_data ->> 'preferred_username',
      split_part(new.email, '@', 1)
    ),
    COALESCE(new.raw_user_meta_data ->> 'role', 'customer')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;
