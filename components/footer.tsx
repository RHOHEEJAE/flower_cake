import Link from "next/link"

const footerCategories = [
  { name: "\uc0c1\uacac\ub808", slug: "sanggyeonrye" },
  { name: "\ud658\uac11\u00b7\uce60\uc21c", slug: "birthday" },
  { name: "\ub3cc\uc7a5\uce58", slug: "dol" },
  { name: "\uacb0\ud63c\u00b7\uc6e8\ub529", slug: "wedding" },
  { name: "\uba85\uc808\u00b7\uc81c\uc0ac", slug: "holiday" },
  { name: "\uacc4\uc808 \ud55c\uc815", slug: "seasonal" },
]

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-cream mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-xl tracking-widest mb-4">
              {"\u82b1\u83d3\u5b50"}
            </h3>
            <p className="font-sans text-sm text-brand-cream/70 leading-relaxed">
              {"\uc804\ud1b5\uc758 \ub9db\uacfc \ud604\ub300\uc801 \uac10\uac01\uc774 \ub9cc\ub098\ub294"}
              <br />
              {"\uc218\uc81c \ud654\uacfc\uc790 \ube0c\ub79c\ub4dc\uc785\ub2c8\ub2e4."}
            </p>
          </div>
          <div>
            <h4 className="font-serif text-sm tracking-wider mb-4 text-brand-cream/80">
              {"\ud14c\ub9c8 \uc120\ubb3c"}
            </h4>
            <div className="grid grid-cols-2 gap-y-2">
              {footerCategories.map(({ name, slug }) => (
                <Link
                  key={slug}
                  href={`/category/${slug}`}
                  className="font-sans text-xs text-brand-cream/60 hover:text-brand-terra transition-colors"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-serif text-sm tracking-wider mb-4 text-brand-cream/80">
              {"\uace0\uac1d \uc548\ub0b4"}
            </h4>
            <div className="flex flex-col gap-2">
              <p className="font-sans text-xs text-brand-cream/60">
                {"\uc8fc\ubb38 \ubb38\uc758: 02-0000-0000"}
              </p>
              <p className="font-sans text-xs text-brand-cream/60">
                {"\uc774\uba54\uc77c: info@wagashi.kr"}
              </p>
              <p className="font-sans text-xs text-brand-cream/60">
                {"\uc6b4\uc601\uc2dc\uac04: \ud3c9\uc77c 10:00 ~ 18:00"}
              </p>
            </div>
            <h4 className="font-serif text-sm tracking-wider mt-6 mb-3 text-brand-cream/80">
              약관
            </h4>
            <div className="flex flex-col gap-1.5">
              <Link
                href="/legal/terms"
                className="font-sans text-xs text-brand-cream/60 hover:text-brand-terra transition-colors"
              >
                서비스 이용약관
              </Link>
              <Link
                href="/legal/privacy"
                className="font-sans text-xs text-brand-cream/60 hover:text-brand-terra transition-colors"
              >
                개인정보 처리방침
              </Link>
              <Link
                href="/legal/commerce"
                className="font-sans text-xs text-brand-cream/60 hover:text-brand-terra transition-colors"
              >
                전자상거래 약관
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-brand-cream/20 mt-8 pt-6 text-center">
          <p className="font-sans text-xs text-brand-cream/40">
            {"\u00a9 2025 \u82b1\u83d3\u5b50 \uc218\uc81c \ud654\uacfc\uc790. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
