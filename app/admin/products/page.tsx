"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils"

export default function AdminProductList() {
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}"을 삭제하시겠습니까?`)) return
    await supabase.from("products").delete().eq("id", id)
    load()
  }

  const stockBadge = (stock: number) => {
    if (stock === 0)
      return <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700">{"품절"}</span>
    if (stock <= 5)
      return <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700">{"소량 남음"}</span>
    return <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700">{"재고 있음"}</span>
  }

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-xl text-brand-dark">{"상품 목록"}</h1>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-brand-terra border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full font-sans text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["이미지", "상품명", "카테고리", "가격", "재고", "상태", "관리"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <img
                      src={p.image_url || `https://picsum.photos/seed/${p.id}/60/60`}
                      alt={p.name}
                      className="w-12 h-12 object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 text-brand-dark max-w-[200px] truncate">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{p.category_slug}</td>
                  <td className="px-4 py-3 font-serif text-brand-dark">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-brand-dark">{p.stock}</td>
                  <td className="px-4 py-3">{stockBadge(p.stock)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      {"삭제"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}
