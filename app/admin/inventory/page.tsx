"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AdminInventory() {
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editStocks, setEditStocks] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})

  const load = async () => {
    const { data } = await supabase
      .from("products")
      .select("id, name, category_slug, stock, created_at")
      .order("stock", { ascending: true })
    setProducts(data || [])
    const stocks: Record<string, number> = {}
    data?.forEach((p) => {
      stocks[p.id] = p.stock
    })
    setEditStocks(stocks)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleSave = async (id: string) => {
    setSaving((s) => ({ ...s, [id]: true }))
    await supabase.from("products").update({ stock: editStocks[id] }).eq("id", id)
    await load()
    setSaving((s) => ({ ...s, [id]: false }))
  }

  const stockBadge = (stock: number) => {
    if (stock === 0) return <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700">{"품절"}</span>
    if (stock <= 5) return <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700">{"소량 남음"}</span>
    return <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700">{"재고 있음"}</span>
  }

  return (
    <main className="flex-1 overflow-auto p-6">
      <h1 className="font-serif text-xl text-brand-dark mb-6">{"재고 관리"}</h1>

      <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-brand-terra border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full font-sans text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["상품명", "카테고리", "현재 재고", "상태", "재고 수정"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-brand-dark max-w-[200px] truncate">{item.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{item.category_slug}</td>
                  <td className="px-4 py-3 font-serif text-brand-dark">{item.stock}</td>
                  <td className="px-4 py-3">{stockBadge(item.stock)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={editStocks[item.id] ?? item.stock}
                        onChange={(e) =>
                          setEditStocks((s) => ({
                            ...s,
                            [item.id]: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="w-20 border border-brand-light px-2 py-1 font-sans text-sm focus:outline-none focus:border-brand-terra text-center"
                      />
                      <button
                        onClick={() => handleSave(item.id)}
                        disabled={saving[item.id] || editStocks[item.id] === item.stock}
                        className="text-xs text-white bg-brand-terra px-2 py-1 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {saving[item.id] ? "..." : "저장"}
                      </button>
                    </div>
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
