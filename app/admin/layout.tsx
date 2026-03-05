import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin-sidebar"
import AdminLayoutShell from "@/components/admin-layout-shell"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 로그인 안 된 상태에서 /admin 접근 시 관리자 로그인 페이지로
  if (!user) {
    redirect("/admin-login")
  }

  // 로그인은 했지만 관리자가 아닌 경우
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (!profile?.is_admin) {
    redirect("/admin-login")
  }

  return (
    <AdminLayoutShell>
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </AdminLayoutShell>
  )
}
