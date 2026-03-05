import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// 서비스 롤 키로 RLS 우회 — 최초 관리자 설정 전용
export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "이메일을 입력하세요." }, { status: 400 })
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // 이미 관리자가 존재하면 거부
    const { count } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin")

    if (count && count > 0) {
      return NextResponse.json(
        { error: "이미 관리자가 존재합니다." },
        { status: 403 }
      )
    }

    // 해당 이메일의 프로필을 관리자로 승격
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({ role: "admin" })
      .eq("email", email)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "해당 이메일 계정을 찾을 수 없습니다. 먼저 회원가입 후 시도하세요." },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: "관리자 계정이 설정되었습니다." })
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
