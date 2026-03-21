"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { signInWithKakao } from "@/lib/auth/oauth"

export default function SocialLoginButtons({
  nextPath,
  disabled,
}: {
  nextPath: string
  /** 필수 약관 미동의 시 true */
  disabled: boolean
}) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleKakao = async () => {
    if (disabled) return
    setLoading(true)
    const { error } = await signInWithKakao(supabase, nextPath)
    if (error) {
      alert(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        disabled={disabled || loading}
        onClick={handleKakao}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-sm font-sans text-sm font-medium bg-[#FEE500] text-[#191919] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
      >
        {loading ? "연결 중…" : "카카오로 계속하기"}
      </button>
    </div>
  )
}
