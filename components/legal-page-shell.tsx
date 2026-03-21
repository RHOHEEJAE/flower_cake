import Link from "next/link"

export default function LegalPageShell({
  title,
  updatedAt,
  children,
}: {
  title: string
  updatedAt: string
  children: React.ReactNode
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="font-sans text-xs text-brand-dark/50 mb-6">
        <Link href="/" className="hover:text-brand-terra">
          홈
        </Link>
        <span className="mx-2">/</span>
        <span className="text-brand-dark/70">{title}</span>
      </nav>
      <h1 className="font-serif text-2xl md:text-3xl text-brand-dark mb-2">{title}</h1>
      <p className="font-sans text-xs text-brand-dark/40 mb-10">시행일: {updatedAt}</p>
      <div className="legal-prose font-sans text-sm text-brand-dark/85 leading-relaxed space-y-5 [&_h2]:font-serif [&_h2]:text-lg [&_h2]:text-brand-dark [&_h2]:mt-8 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
        {children}
      </div>
    </div>
  )
}
