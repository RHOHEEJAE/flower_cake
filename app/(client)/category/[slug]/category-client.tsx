"use client"

import { useState, useMemo } from "react"
import ProductCard from "@/components/product-card"

interface Product {
  id: string
  name: string
  price: number
  image_url?: string
  stock: number
  created_at: string
}

const SORT_OPTIONS = [
  { value: "newest", label: "신상품순" },
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
]

export default function CategoryClient({
  info,
  slug,
  initialProducts,
}: {
  info: { name: string; desc: string }
  slug: string
  initialProducts: Product[]
}) {
  const [sort, setSort] = useState("newest")

  const products = useMemo(() => {
    const sorted = [...initialProducts]
    if (sort === "price_asc") sorted.sort((a, b) => a.price - b.price)
    else if (sort === "price_desc") sorted.sort((a, b) => b.price - a.price)
    return sorted
  }, [initialProducts, sort])

  return (
    <div>
      {/* Category header */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${slug}/1200/400`}
          alt={info.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-3xl md:text-4xl text-white tracking-widest mb-2">
            {info.name}
          </h1>
          <p className="font-sans text-sm text-white/70">{info.desc}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter bar */}
        <div className="flex items-center justify-between mb-8">
          <p className="font-sans text-sm text-brand-dark/50">
            {"총 "}
            <span className="text-brand-dark font-medium">
              {products.length}
            </span>
            {"개 상품"}
          </p>
          <div className="flex gap-2">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`font-sans text-xs px-3 py-1.5 border transition-colors ${
                  sort === opt.value
                    ? "bg-brand-dark text-brand-cream border-brand-dark"
                    : "border-brand-light text-brand-dark hover:border-brand-terra"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-brand-dark/40 text-lg mb-2">
              {"상품이 없습니다"}
            </p>
            <p className="font-sans text-sm text-brand-dark/30">
              {"현재 준비 중인 상품입니다."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
