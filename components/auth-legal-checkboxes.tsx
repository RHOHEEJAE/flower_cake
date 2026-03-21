"use client"

import Link from "next/link"

type Props = {
  agreeTerms: boolean
  agreePrivacy: boolean
  agreeCommerce: boolean
  agreeMarketing: boolean
  onChangeTerms: (v: boolean) => void
  onChangePrivacy: (v: boolean) => void
  onChangeCommerce: (v: boolean) => void
  onChangeMarketing: (v: boolean) => void
  /** 회원가입에서만 마케팅 선택 동의 표시 */
  showMarketing?: boolean
}

export default function AuthLegalCheckboxes({
  agreeTerms,
  agreePrivacy,
  agreeCommerce,
  agreeMarketing,
  onChangeTerms,
  onChangePrivacy,
  onChangeCommerce,
  onChangeMarketing,
  showMarketing = true,
}: Props) {
  return (
    <div className="space-y-3 border border-brand-light/60 p-4 bg-brand-bg/30">
      <p className="font-sans text-xs text-brand-dark/70 font-medium">약관 동의</p>
      <label className="flex gap-2.5 items-start cursor-pointer">
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => onChangeTerms(e.target.checked)}
          className="mt-0.5 accent-brand-terra"
        />
        <span className="font-sans text-xs text-brand-dark/80 leading-relaxed">
          <Link href="/legal/terms" target="_blank" className="text-brand-terra underline underline-offset-2">
            서비스 이용약관
          </Link>
          에 동의합니다. (필수)
        </span>
      </label>
      <label className="flex gap-2.5 items-start cursor-pointer">
        <input
          type="checkbox"
          checked={agreePrivacy}
          onChange={(e) => onChangePrivacy(e.target.checked)}
          className="mt-0.5 accent-brand-terra"
        />
        <span className="font-sans text-xs text-brand-dark/80 leading-relaxed">
          <Link href="/legal/privacy" target="_blank" className="text-brand-terra underline underline-offset-2">
            개인정보 처리방침
          </Link>
          에 동의합니다. (필수)
        </span>
      </label>
      <label className="flex gap-2.5 items-start cursor-pointer">
        <input
          type="checkbox"
          checked={agreeCommerce}
          onChange={(e) => onChangeCommerce(e.target.checked)}
          className="mt-0.5 accent-brand-terra"
        />
        <span className="font-sans text-xs text-brand-dark/80 leading-relaxed">
          <Link href="/legal/commerce" target="_blank" className="text-brand-terra underline underline-offset-2">
            전자상거래 약관
          </Link>
          에 동의합니다. (필수)
        </span>
      </label>
      {showMarketing && (
        <label className="flex gap-2.5 items-start cursor-pointer">
          <input
            type="checkbox"
            checked={agreeMarketing}
            onChange={(e) => onChangeMarketing(e.target.checked)}
            className="mt-0.5 accent-brand-terra"
          />
          <span className="font-sans text-xs text-brand-dark/80 leading-relaxed">
            이벤트·혜택 등 마케팅 정보 수신에 동의합니다. (선택)
          </span>
        </label>
      )}
    </div>
  )
}
