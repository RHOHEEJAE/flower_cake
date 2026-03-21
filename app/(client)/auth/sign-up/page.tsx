"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import AuthLegalCheckboxes from "@/components/auth-legal-checkboxes"
import SocialLoginButtons from "@/components/social-login-buttons"

export default function SignUpPage() {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  })
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [agreeCommerce, setAgreeCommerce] = useState(false)
  const [agreeMarketing, setAgreeMarketing] = useState(false)

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const legalOk = agreeTerms && agreePrivacy && agreeCommerce

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!legalOk) {
      setError("필수 약관에 모두 동의해 주세요.")
      return
    }
    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }
    if (form.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${typeof window !== "undefined" ? window.location.origin : ""}/`,
        data: {
          name: form.name,
          marketing_agreed: agreeMarketing,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/auth/sign-up-success")
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-brand-dark tracking-widest mb-2">{"BE:UM"}</h1>
          <p className="font-sans text-sm text-brand-dark/50">{"회원가입"}</p>
        </div>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <div>
            <label className="block font-sans text-xs text-brand-dark/60 mb-1">{"이름"}</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              required
              className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm text-brand-dark focus:outline-none focus:border-brand-terra"
            />
          </div>
          <div>
            <label className="block font-sans text-xs text-brand-dark/60 mb-1">{"이메일"}</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
              className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm text-brand-dark focus:outline-none focus:border-brand-terra"
            />
          </div>
          <div>
            <label className="block font-sans text-xs text-brand-dark/60 mb-1">{"비밀번호"}</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="6자 이상 입력하세요"
              required
              className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm text-brand-dark focus:outline-none focus:border-brand-terra"
            />
          </div>
          <div>
            <label className="block font-sans text-xs text-brand-dark/60 mb-1">{"비밀번호 확인"}</label>
            <input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              required
              className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm text-brand-dark focus:outline-none focus:border-brand-terra"
            />
          </div>

          <AuthLegalCheckboxes
            agreeTerms={agreeTerms}
            agreePrivacy={agreePrivacy}
            agreeCommerce={agreeCommerce}
            agreeMarketing={agreeMarketing}
            onChangeTerms={setAgreeTerms}
            onChangePrivacy={setAgreePrivacy}
            onChangeCommerce={setAgreeCommerce}
            onChangeMarketing={setAgreeMarketing}
            showMarketing
          />

          {error && <p className="font-sans text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || !legalOk}
            className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brand-light/60" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-brand-bg px-3 font-sans text-xs text-brand-dark/40">또는 카카오로 가입</span>
          </div>
        </div>

        <SocialLoginButtons nextPath="/" disabled={!legalOk} />
        {!legalOk && (
          <p className="font-sans text-[11px] text-brand-dark/45 text-center mt-2">
            카카오 가입은 위 필수 약관에 모두 동의한 뒤 이용할 수 있습니다.
          </p>
        )}

        <div className="text-center mt-8">
          <p className="font-sans text-sm text-brand-dark/50">
            {"이미 계정이 있으신가요? "}
            <Link href="/auth/login" className="text-brand-terra hover:underline">
              {"로그인"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
