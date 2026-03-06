"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isUnauthorized = searchParams.get("error") === "unauthorized"

  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.")
      setLoading(false)
      return
    }

    // 로그인 성공 후 관리자 권한 확인
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("로그인에 실패했습니다.")
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (!profile || profile.role !== "admin") {
      await supabase.auth.signOut()
      setError("관리자 권한이 없는 계정입니다.")
      setLoading(false)
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-brand-cream tracking-widest mb-1">
            BE:UM
          </h1>
          <p className="font-sans text-xs text-brand-cream/30 tracking-widest uppercase">
            Admin
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-white p-8">
          <h2 className="font-serif text-base text-brand-dark text-center mb-6">
            관리자 로그인
          </h2>

          {isUnauthorized && !error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 font-sans text-xs text-center">
              관리자 권한이 없습니다.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 font-sans text-xs text-center">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block font-sans text-xs text-brand-dark/60 mb-1">
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                autoComplete="email"
                className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-terra"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-brand-dark/60 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-terra"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-terra text-white py-3 font-serif font-semibold tracking-wider hover:bg-opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="text-center mt-4 font-sans text-xs text-brand-cream/30">
          관리자 계정 설정은 Supabase 대시보드에서 진행하세요
        </p>
      </div>
    </div>
  )
}
