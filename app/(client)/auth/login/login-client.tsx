"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import AuthLegalCheckboxes from "@/components/auth-legal-checkboxes"
import SocialLoginButtons from "@/components/social-login-buttons"

function LoginFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const oauthError = searchParams.get("error")
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [agreeCommerce, setAgreeCommerce] = useState(false)

  const socialReady = agreeTerms && agreePrivacy && agreeCommerce

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
          <h1 className="font-serif text-3xl text-brand-dark tracking-widest mb-2">{"BE:UM"}</h1>
          <p className="font-sans text-sm text-brand-dark/50">{"로그인하여 주문하기"}</p>
        </div>

        {oauthError && (
          <p className="font-sans text-xs text-red-600 mb-4 text-center bg-red-50 py-2 px-3 rounded-sm">
            {oauthError === "oauth"
              ? "카카오 로그인에 실패했습니다. Supabase에서 카카오 연동을 확인해 주세요."
              : "로그인 처리 중 오류가 발생했습니다."}
          </p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block font-sans text-xs text-brand-dark/60 mb-1">{"이메일"}</label>
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
            <label className="block font-sans text-xs text-brand-dark/60 mb-1">{"비밀번호"}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm text-brand-dark focus:outline-none focus:border-brand-terra"
            />
          </div>

          {error && <p className="font-sans text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-light/60" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-brand-bg px-3 font-sans text-xs text-brand-dark/40">또는 카카오로</span>
          </div>
        </div>

        <AuthLegalCheckboxes
          agreeTerms={agreeTerms}
          agreePrivacy={agreePrivacy}
          agreeCommerce={agreeCommerce}
          agreeMarketing={false}
          onChangeTerms={setAgreeTerms}
          onChangePrivacy={setAgreePrivacy}
          onChangeCommerce={setAgreeCommerce}
          onChangeMarketing={() => {}}
          showMarketing={false}
        />

        <div className="mt-4">
          <SocialLoginButtons nextPath={redirect} disabled={!socialReady} />
        </div>
        {!socialReady && (
          <p className="font-sans text-[11px] text-brand-dark/45 text-center mt-2">
            카카오 로그인은 위 필수 약관에 모두 동의한 뒤 이용할 수 있습니다.
          </p>
        )}

        <div className="text-center mt-8">
          <p className="font-sans text-sm text-brand-dark/50">
            {"계정이 없으신가요? "}
            <Link href="/auth/sign-up" className="text-brand-terra hover:underline">
              {"회원가입"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function LoginFallback() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="font-sans text-sm text-brand-dark/50">로딩 중…</div>
    </div>
  )
}

export default function LoginClient() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginFormInner />
    </Suspense>
  )
}
