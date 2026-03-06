"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const NAV_ITEMS = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/products", label: "상품 목록" },
  { href: "/admin/orders", label: "주문 목록" },
  { href: "/admin/inventory", label: "재고 관리" },
  { href: "/admin/members", label: "회원 관리" },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <aside className="w-56 min-h-screen bg-brand-dark flex flex-col shrink-0">
      <div className="p-6 border-b border-brand-cream/10">
        <h1 className="font-serif text-lg text-brand-cream tracking-widest">
          {"BE:UM"}
        </h1>
        <p className="font-sans text-xs text-brand-cream/40 mt-1">
          {"관리자 대시보드"}
        </p>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 font-sans text-sm transition-colors ${
                isActive
                  ? "bg-brand-terra text-white"
                  : "text-brand-cream/60 hover:text-brand-cream hover:bg-brand-cream/5"
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3">
        <Link
          href="/"
          className="flex items-center gap-3 w-full px-3 py-2.5 font-sans text-sm text-brand-cream/40 hover:text-brand-cream transition-colors mb-1"
        >
          {"쇼핑몰로 이동"}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 font-sans text-sm text-brand-cream/40 hover:text-brand-cream transition-colors"
        >
          {"로그아웃"}
        </button>
      </div>
    </aside>
  )
}
