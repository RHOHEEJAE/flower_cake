import { createClient } from "@/lib/supabase/server"
import CategoryClient from "./category-client"

const CATEGORY_INFO: Record<string, { name: string; desc: string }> = {
  sanggyeonrye: { name: "상견례", desc: "첫 만남의 격식과 정성을 담은 선물 세트" },
  birthday: { name: "환갑·칠순", desc: "장수와 감사를 담은 고급 화과자" },
  dol: { name: "돌잔치", desc: "아이의 첫 생일을 축하하는 귀여운 디자인" },
  wedding: { name: "결혼·웨딩", desc: "두 사람의 시작을 축하하는 우아한 세트" },
  holiday: { name: "명절·제사", desc: "추석·설날 전통 화과자" },
  corporate: { name: "기업·답례품", desc: "로고 각인 가능한 단체 주문용" },
  seasonal: { name: "계절 한정", desc: "봄·여름·가을·겨울 시즌 특별 화과자" },
  "gift-set": { name: "선물 세트", desc: "2종·5종·10종 혼합 구성" },
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const info = CATEGORY_INFO[slug] || { name: slug, desc: "" }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("category_slug", slug)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <CategoryClient
      info={info}
      slug={slug}
      initialProducts={products || []}
    />
  )
}
