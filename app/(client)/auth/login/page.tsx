"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.")
      setLoading(false)
      return
    }

    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-brand-dark tracking-widest mb-2">
            {"花菓子"}
          </h1>
          <p className="font-sans text-sm text-brand-dark/50">
            {"로그인하여 주문하기"}
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block font-sans text-xs text-brand-dark/60 mb-1">
              {"이메일"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
              className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm text-brand-dark focus:outline-none focus:border-brand-terra"
            />
          </div>
          <div>
            <label className="block font-sans text-xs text-brand-dark/60 mb-1">
              {"비밀번호"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm text-brand-dark focus:outline-none focus:border-brand-terra"
            />
          </div>

          {error && (
            <p className="font-sans text-xs text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="font-sans text-sm text-brand-dark/50">
            {"계정이 없으신가요? "}
            <Link
              href="/auth/sign-up"
              className="text-brand-terra hover:underline"
            >
              {"회원가입"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
