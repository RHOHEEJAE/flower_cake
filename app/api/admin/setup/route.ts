import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// 최초 관리자 설정 API
// 관리자가 한 명도 없을 때만 동작 (보안)
export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "이메일을 입력하세요." }, { status: 400 })
    }

    const supabase = await createClient()

    // 이미 관리자가 존재하면 거부
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin")

    if (count && count > 0) {
      return NextResponse.json(
        { error: "이미 관리자가 존재합니다. Supabase 대시보드를 이용하세요." },
        { status: 403 }
      )
    }

    // 해당 이메일의 프로필을 관리자로 승격
    const { data, error } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("email", email)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "해당 이메일의 계정을 찾을 수 없습니다. 먼저 회원가입 후 시도하세요." },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: "관리자 계정이 설정되었습니다." })
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
