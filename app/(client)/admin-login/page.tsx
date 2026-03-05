"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.")
      setLoading(false)
      return
    }

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
      .select("is_admin")
      .eq("id", user.id)
      .single()

    if (!profile?.is_admin) {
      await supabase.auth.signOut()
      setError("관리자 권한이 없습니다.")
      setLoading(false)
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark">
      <div className="w-full max-w-sm bg-white p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl text-brand-dark tracking-widest">
            {"花菓子"}
          </h1>
          <p className="font-sans text-sm text-brand-dark/50 mt-2">
            {"관리자 로그인"}
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block font-sans text-xs text-brand-dark/60 mb-1.5"
            >
              {"이메일"}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-brand-cream bg-brand-cream/20 font-sans text-sm text-brand-dark focus:outline-none focus:border-brand-terra"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-sans text-xs text-brand-dark/60 mb-1.5"
            >
              {"비밀번호"}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-brand-cream bg-brand-cream/20 font-sans text-sm text-brand-dark focus:outline-none focus:border-brand-terra"
              placeholder="6자 이상 입력"
            />
          </div>

          {error && (
            <p className="font-sans text-xs text-red-600 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-terra text-white font-sans text-sm tracking-wide hover:bg-brand-terra/90 transition-colors disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  )
}
