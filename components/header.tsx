"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import useCartStore from "@/lib/store/use-cart-store"
import type { User } from "@supabase/supabase-js"

const categories = [
  { name: "상견례", slug: "sanggyeonrye" },
  { name: "환갑·칠순", slug: "birthday" },
  { name: "돌잔치", slug: "dol" },
  { name: "결혼·웨딩", slug: "wedding" },
  { name: "명절·제사", slug: "holiday" },
  { name: "기업·답례품", slug: "corporate" },
  { name: "계절 한정", slug: "seasonal" },
  { name: "선물 세트", slug: "gift-set" },
]

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const totalCount = useCartStore((s) => s.totalCount())
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
    router.refresh()
  }

  return (
    <header className="bg-brand-bg border-b border-brand-light sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-serif text-2xl font-semibold text-brand-dark tracking-widest"
          >
            {"花菓子"}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <button className="font-serif text-sm tracking-wider text-brand-dark hover:text-brand-terra transition-colors">
                {"테마 선물"}
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-brand-light shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="block px-4 py-2.5 text-sm text-brand-dark hover:bg-brand-cream hover:text-brand-terra transition-colors font-sans"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-brand-dark hover:text-brand-terra transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-terra text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-sans">
                  {totalCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative group">
                <button className="font-sans text-sm text-brand-dark hover:text-brand-terra transition-colors flex items-center gap-1">
                  <span className="hidden md:inline">
                    {user.user_metadata?.name || user.email?.split("@")[0]}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-brand-light shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    href="/mypage"
                    className="block px-4 py-2.5 text-sm text-brand-dark hover:bg-brand-cream transition-colors"
                  >
                    {"마이페이지"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm text-brand-dark hover:bg-brand-cream transition-colors"
                  >
                    {"로그아웃"}
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="font-sans text-sm text-brand-dark hover:text-brand-terra transition-colors"
              >
                {"로그인"}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-brand-dark"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="메뉴 열기"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d={
                    menuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-brand-light py-4">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="w-full text-left px-2 py-2 font-serif text-brand-dark flex justify-between items-center"
            >
              {"테마 선물"}
              <svg
                className={`w-4 h-4 transition-transform ${catOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {catOpen &&
              categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="block px-6 py-2 text-sm text-brand-dark hover:text-brand-terra"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        )}
      </div>
    </header>
  )
}
