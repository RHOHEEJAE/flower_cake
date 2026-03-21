"use client"

import { useState } from "react"
import Link from "next/link"
import useCartStore from "@/lib/store/use-cart-store"
import ProductCard from "@/components/product-card"
import { formatPrice, productPrimaryImage } from "@/lib/utils"

interface Product {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  images?: string[]
  category_slug?: string
  stock: number
  allergens?: string
  storage_method?: string
  shelf_life?: string
}

const TABS = ["상세 정보", "배송 안내", "교환·환불"]

export default function ProductDetailClient({
  product,
  related,
}: {
  product: Product
  related: Product[]
}) {
  const addItem = useCartStore((s) => s.addItem)
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState(0)

  const image =
    productPrimaryImage(product) ||
    `https://picsum.photos/seed/${product.id}/600/600`

  const handleAddToCart = () => {
    addItem(product, qty)
    alert(`"${product.name}"을 장바구니에 담았습니다.`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div>
          <div className="aspect-square overflow-hidden bg-brand-cream/30">
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div>
          {product.category_slug && (
            <div className="mb-2">
              <span className="font-sans text-xs text-brand-terra">
                {product.category_slug}
              </span>
            </div>
          )}
          <h1 className="font-serif text-2xl md:text-3xl text-brand-dark mb-4 leading-relaxed text-balance">
            {product.name}
          </h1>
          <div className="text-3xl font-serif font-semibold text-brand-dark mb-4">
            {formatPrice(product.price)}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock === 0 ? (
              <span className="font-sans text-sm text-red-600">{"품절"}</span>
            ) : product.stock <= 5 ? (
              <span className="font-sans text-sm text-orange-600">
                {`소량 남음 (${product.stock}개)`}
              </span>
            ) : (
              <span className="font-sans text-sm text-green-700">
                {"재고 있음"}
              </span>
            )}
          </div>

          {/* Qty */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <span className="font-sans text-sm text-brand-dark/60">
                {"수량"}
              </span>
              <div className="flex items-center border border-brand-light">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-brand-dark hover:bg-brand-cream transition-colors"
                >
                  {"-"}
                </button>
                <span className="px-4 py-2 font-sans text-sm text-brand-dark border-x border-brand-light">
                  {qty}
                </span>
                <button
                  onClick={() =>
                    setQty((q) => Math.min(product.stock, q + 1))
                  }
                  className="px-3 py-2 text-brand-dark hover:bg-brand-cream transition-colors"
                >
                  {"+"}
                </button>
              </div>
            </div>
          )}

          {/* Cart button */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? "품절" : "장바구니 담기"}
            </button>
          </div>

          {/* Quick info */}
          <div className="mt-8 border-t border-brand-light pt-6 flex flex-col gap-3">
            {product.storage_method && (
              <div className="flex gap-4 font-sans text-sm">
                <span className="text-brand-dark/40 w-20 shrink-0">
                  {"보관 방법"}
                </span>
                <span className="text-brand-dark">
                  {product.storage_method}
                </span>
              </div>
            )}
            {product.shelf_life && (
              <div className="flex gap-4 font-sans text-sm">
                <span className="text-brand-dark/40 w-20 shrink-0">
                  {"유통기한"}
                </span>
                <span className="text-brand-dark">{product.shelf_life}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="flex border-b border-brand-light">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`font-sans text-sm px-6 py-3 border-b-2 transition-colors -mb-px ${
                activeTab === i
                  ? "border-brand-terra text-brand-terra"
                  : "border-transparent text-brand-dark/50 hover:text-brand-dark"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="py-8 font-sans text-sm text-brand-dark/70 leading-8">
          {activeTab === 0 && (
            <div className="flex flex-col gap-4">
              <p>{product.description}</p>
              {product.allergens && (
                <div className="mt-4 p-4 bg-brand-cream/30">
                  <p className="font-medium text-brand-dark mb-1">
                    {"알레르기 정보"}
                  </p>
                  <p>{product.allergens}</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 1 && (
            <div className="flex flex-col gap-3">
              <p>{"- 주문 후 1~2일 내 출고됩니다 (주말·공휴일 제외)."}</p>
              <p>{"- 신선한 상품을 위해 아이스팩과 함께 배송됩니다."}</p>
              <p>{"- 배송비: 3만원 이상 무료배송, 미만 시 3,000원"}</p>
              <p>
                {
                  "- 제주 및 도서산간 지역은 추가 배송비가 부과될 수 있습니다."
                }
              </p>
            </div>
          )}
          {activeTab === 2 && (
            <div className="flex flex-col gap-3">
              <p>
                {
                  "- 식품 특성상 단순 변심에 의한 교환·환불은 불가합니다."
                }
              </p>
              <p>
                {
                  "- 상품 불량 또는 오배송의 경우 수령 후 24시간 이내 연락 주세요."
                }
              </p>
              <p>{"- 문의: 02-0000-0000 / info@wagashi.kr"}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title">{"관련 상품"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
