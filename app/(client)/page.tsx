import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import ProductCard from "@/components/product-card"

const CATEGORIES = [
  { name: "상견례", slug: "sanggyeonrye", desc: "첫 만남의 정성" },
  { name: "환갑·칠순", slug: "birthday", desc: "장수와 감사" },
  { name: "돌잔치", slug: "dol", desc: "첫 돌의 기쁨" },
  { name: "결혼·웨딩", slug: "wedding", desc: "두 사람의 시작" },
  { name: "명절·제사", slug: "holiday", desc: "전통의 맛" },
  { name: "기업·답례품", slug: "corporate", desc: "격조 있는 선물" },
  { name: "계절 한정", slug: "seasonal", desc: "계절의 향기" },
  { name: "선물 세트", slug: "gift-set", desc: "혼합 구성" },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: bestProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <section className="relative h-[90vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/seed/wagashi-hero/1920/1080"
            alt="히어로 배경"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/50 via-brand-dark/30 to-brand-dark/60" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <p className="font-sans text-brand-cream/80 text-sm tracking-[0.3em] mb-4 uppercase">
            Handcrafted Wagashi
          </p>
          <h1 className="font-serif text-5xl md:text-7xl text-white tracking-widest mb-6 leading-tight text-balance">
            {"花菓子"}
          </h1>
          <p className="font-serif text-brand-cream/90 text-lg md:text-2xl tracking-wide mb-10 italic">
            {"정성으로 빚은 화과자, 마음을 담은 선물"}
          </p>
          <Link
            href="/category/gift-set"
            className="btn-primary text-sm tracking-[0.2em] uppercase"
          >
            {"선물 고르기"}
          </Link>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="section-title text-center">{"테마별 선물"}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group bg-white border border-brand-light hover:border-brand-terra p-6 text-center transition-all duration-200 hover:shadow-md"
            >
              <h3 className="font-serif text-sm text-brand-dark mb-1">
                {cat.name}
              </h3>
              <p className="font-sans text-xs text-brand-dark/50">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Products */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <h2 className="section-title mb-0">{"베스트 상품"}</h2>
          <Link
            href="/category/gift-set"
            className="font-sans text-sm text-brand-terra hover:underline"
          >
            {"전체 보기"}
          </Link>
        </div>
        {bestProducts && bestProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-brand-dark/40 font-sans py-12">
            {"상품을 준비 중입니다..."}
          </p>
        )}
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-brand-dark">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://picsum.photos/seed/artisan/800/600"
              alt="장인"
              className="w-full object-cover"
            />
          </div>
          <div className="text-brand-cream">
            <p className="font-sans text-xs tracking-[0.3em] text-brand-terra mb-4 uppercase">
              Brand Story
            </p>
            <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-relaxed text-balance">
              {"전통의 손맛,"}
              <br />
              {"현대의 감각"}
            </h2>
            <p className="font-sans text-sm text-brand-cream/70 leading-8 mb-6">
              {"3대째 이어져 온 화과자 장인의 손끝에서 탄생하는 수제 화과자. 오직 국내산 재료만을 사용하여 하나하나 정성을 담아 만들고 있습니다. 매일 새벽 만들어지는 신선한 화과자로 소중한 분에게 마음을 전하세요."}
            </p>
            <Link
              href="/category/gift-set"
              className="font-serif text-sm tracking-wider text-brand-terra border-b border-brand-terra pb-1 hover:text-white hover:border-white transition-colors"
            >
              {"더 알아보기 →"}
            </Link>
          </div>
        </div>
      </section>

      {/* Seasonal Banner */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-brand-cream">
          <div className="grid md:grid-cols-2">
            <div className="p-12 flex flex-col justify-center">
              <p className="font-sans text-xs tracking-[0.3em] text-brand-terra mb-3 uppercase">
                Seasonal Limited
              </p>
              <h2 className="font-serif text-3xl text-brand-dark mb-4 leading-relaxed text-balance">
                {"계절을 담은"}
                <br />
                {"한정 화과자"}
              </h2>
              <p className="font-sans text-sm text-brand-dark/60 mb-8 leading-7">
                {"봄의 벚꽃, 여름의 수국, 가을의 단풍, 겨울의 설화를 담아 계절마다 새롭게 선보이는 한정 화과자입니다."}
              </p>
              <Link
                href="/category/seasonal"
                className="btn-primary self-start text-sm tracking-wider"
              >
                {"한정 상품 보기"}
              </Link>
            </div>
            <div className="hidden md:block">
              <img
                src="https://picsum.photos/seed/seasonal-banner/800/600"
                alt="계절 한정"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="section-title text-center">{"고객 후기"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "김**",
              text: "결혼 상견례 선물로 구매했는데 양가 부모님께서 너무 좋아하셨어요. 포장도 고급스럽고 맛도 훌륭했습니다.",
            },
            {
              name: "이**",
              text: "돌잔치 답례품으로 주문했습니다. 귀엽고 맛있어서 손님들 모두 칭찬하셨어요. 다음에도 꼭 주문할 예정이에요.",
            },
            {
              name: "박**",
              text: "계절 한정 화과자를 선물받았는데 정말 예쁘고 맛있었어요. 가격 대비 퀄리티가 정말 좋습니다.",
            },
          ].map((review, i) => (
            <div key={i} className="bg-white border border-brand-light p-6">
              <div className="flex text-brand-terra mb-3">
                {"★★★★★"}
              </div>
              <p className="font-sans text-sm text-brand-dark/70 leading-7 mb-4">
                {`"${review.text}"`}
              </p>
              <p className="font-sans text-xs text-brand-dark/40">
                {`— ${review.name}`}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
