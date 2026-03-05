import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-full bg-brand-terra/10 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-brand-terra"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="font-serif text-2xl text-brand-dark mb-3">
          {"이메일을 확인해 주세요"}
        </h1>
        <p className="font-sans text-sm text-brand-dark/50 mb-8 leading-relaxed">
          {"가입하신 이메일로 확인 링크를 보내드렸습니다. 이메일을 확인한 후 로그인해 주세요."}
        </p>
        <Link href="/auth/login" className="btn-primary text-sm">
          {"로그인 페이지로"}
        </Link>
      </div>
    </div>
  )
}
