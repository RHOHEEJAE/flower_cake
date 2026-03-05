"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils"

const CATEGORIES = [
  { label: "상견례", value: "sanggyeonrye" },
  { label: "환갑·칠순", value: "birthday" },
  { label: "돌잔치", value: "dol" },
  { label: "결혼·웨딩", value: "wedding" },
  { label: "명절·제사", value: "holiday" },
  { label: "기업·답례품", value: "corporate" },
  { label: "계절 한정", value: "seasonal" },
  { label: "선물 세트", value: "gift-set" },
]

const EMPTY_FORM = {
  name: "",
  category_slug: "sanggyeonrye",
  price: "",
  stock: "",
  description: "",
  ingredients: "",
  storage: "",
  shelf_life: "",
  image_url: "",
  is_active: true,
}

export default function AdminProductList() {
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [form, setForm] = useState<any>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

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

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setError("")
    setModal("add")
  }

  const openEdit = (p: any) => {
    setForm({
      id: p.id,
      name: p.name,
      category_slug: p.category_slug,
      price: String(p.price),
      stock: String(p.stock),
      description: p.description || "",
      ingredients: p.ingredients || "",
      storage: p.storage || "",
      shelf_life: p.shelf_life || "",
      image_url: p.images?.[0] || "",
      is_active: p.is_active,
    })
    setError("")
    setModal("edit")
  }

  const closeModal = () => {
    setModal(null)
    setError("")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) {
      setError("상품명, 가격, 재고는 필수입니다.")
      return
    }
    setSaving(true)
    setError("")

    const payload = {
      name: form.name,
      category_slug: form.category_slug,
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description,
      ingredients: form.ingredients,
      storage: form.storage,
      shelf_life: form.shelf_life,
      images: form.image_url ? [form.image_url] : [],
      is_active: form.is_active,
    }

    let err
    if (modal === "add") {
      const res = await supabase.from("products").insert(payload)
      err = res.error
    } else {
      const res = await supabase.from("products").update(payload).eq("id", form.id)
      err = res.error
    }

    setSaving(false)
    if (err) {
      setError(err.message)
    } else {
      closeModal()
      load()
    }
  }

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
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-brand-terra text-white text-sm hover:opacity-90 transition"
        >
          {"+ 상품 추가"}
        </button>
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
                      src={p.images?.[0] || `https://picsum.photos/seed/${p.id}/60/60`}
                      alt={p.name}
                      className="w-12 h-12 object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 text-brand-dark max-w-[200px] truncate">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{p.category_slug}</td>
                  <td className="px-4 py-3 font-serif text-brand-dark">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-brand-dark">{p.stock}</td>
                  <td className="px-4 py-3">{stockBadge(p.stock)}</td>
                  <td className="px-4 py-3 flex gap-3">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-xs text-brand-terra hover:underline"
                    >
                      {"수정"}
                    </button>
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

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-serif text-lg text-brand-dark">
                {modal === "add" ? "상품 추가" : "상품 수정"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
                {"×"}
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">{"상품명 *"}</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-brand-terra"
                  placeholder="상품명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">{"카테고리 *"}</label>
                <select
                  name="category_slug"
                  value={form.category_slug}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-brand-terra"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{"가격 (원) *"}</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-brand-terra"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{"재고 *"}</label>
                  <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-brand-terra"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">{"상품 설명"}</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-brand-terra resize-none"
                  placeholder="상품 설명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">{"재료"}</label>
                <input
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-brand-terra"
                  placeholder="예: 찹쌀가루, 팥앙금, 백앙금"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{"보관방법"}</label>
                  <input
                    name="storage"
                    value={form.storage}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-brand-terra"
                    placeholder="예: 냉장"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{"유통기한"}</label>
                  <input
                    name="shelf_life"
                    value={form.shelf_life}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-brand-terra"
                    placeholder="예: 제조일로부터 5일"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">{"이미지 URL"}</label>
                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-brand-terra"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="accent-brand-terra"
                />
                <label htmlFor="is_active" className="text-sm text-gray-600">{"판매 활성화"}</label>
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-gray-500 border border-gray-200 hover:bg-gray-50"
              >
                {"취소"}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm bg-brand-terra text-white hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "저장 중..." : modal === "add" ? "추가" : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
