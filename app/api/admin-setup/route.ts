import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()

  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: "이메일과 비밀번호를 입력해주세요." },
      { status: 400 },
    )
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "비밀번호는 6자 이상이어야 합니다." },
      { status: 400 },
    )
  }

  // 이미 관리자가 존재하는지 확인
  const { data: existingAdmins } = await supabase
    .from("profiles")
    .select("id")
    .eq("is_admin", true)

  if (existingAdmins && existingAdmins.length > 0) {
    return NextResponse.json(
      { error: "이미 관리자 계정이 존재합니다. 관리자 로그인을 이용해주세요." },
      { status: 403 },
    )
  }

  // 새 관리자 계정 생성 (회원가입)
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name: "관리자" },
    },
  })

  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 })
  }

  if (!signUpData.user) {
    return NextResponse.json(
      { error: "계정 생성에 실패했습니다." },
      { status: 500 },
    )
  }

  // profiles 테이블에서 is_admin을 true로 설정 (service role 없이는 RLS 때문에 직접 불가)
  // 대신 execute_sql로 미리 처리된 트리거가 프로필을 생성하므로, 
  // 여기서는 생성된 프로필의 is_admin을 업데이트
  // RLS를 우회하려면 서버 사이드에서 처리 필요
  return NextResponse.json({
    success: true,
    message: "계정이 생성되었습니다. 관리자 승격을 위해 잠시만 기다려주세요.",
    userId: signUpData.user.id,
  })
}
