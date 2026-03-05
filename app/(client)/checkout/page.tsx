"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import useCartStore from "@/lib/store/use-cart-store"
import { formatPrice } from "@/lib/utils"

export default function CheckoutPage() {
  const router = useRouter()
  const supabase = createClient()
  const { items, totalPrice, clearCart } = useCartStore()
  const [form, setForm] = useState({
    recipient_name: "",
    recipient_phone: "",
    recipient_address: "",
    delivery_memo: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("profiles")
          .select("name, phone, address")
          .eq("id", user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setForm((f) => ({
                ...f,
                recipient_name: profile.name || "",
                recipient_phone: profile.phone || "",
                recipient_address: profile.address || "",
              }))
            }
          })
      }
    })
  }, [])

  if (items.length === 0) {
    router.replace("/cart")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.recipient_name || !form.recipient_phone || !form.recipient_address) {
      setError("필수 항목을 모두 입력해 주세요.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { data, error: dbError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            qty: i.qty,
            price: i.price,
          })),
          total_amount: totalPrice(),
          ...form,
        })
        .select("id")
        .single()

      if (dbError) throw dbError
      clearCart()
      router.push(`/order-complete/${data.id}`)
    } catch (err: any) {
      setError(err?.message || "주문 처리 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="section-title">{"주문 / 결제"}</h1>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-8">
        {/* Delivery info */}
        <div className="md:col-span-3">
          <div className="bg-white border border-brand-light p-6">
            <h2 className="font-serif text-base text-brand-dark mb-4">
              {"배송 정보"}
            </h2>
            <div className="flex flex-col gap-4">
              {[
                {
                  name: "recipient_name",
                  label: "받는 분 *",
                  type: "text",
                  placeholder: "이름을 입력하세요",
                },
                {
                  name: "recipient_phone",
                  label: "연락처 *",
                  type: "tel",
                  placeholder: "010-0000-0000",
                },
                {
                  name: "recipient_address",
                  label: "배송지 *",
                  type: "text",
                  placeholder: "배송지 주소를 입력하세요",
                },
                {
                  name: "delivery_memo",
                  label: "배송 메모",
                  type: "text",
                  placeholder: "예) 선물 포장 요청",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block font-sans text-xs text-brand-dark/60 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm text-brand-dark focus:outline-none focus:border-brand-terra"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="md:col-span-2">
          <div className="bg-white border border-brand-light p-6 sticky top-20">
            <h2 className="font-serif text-base text-brand-dark mb-4">
              {"주문 상품"}
            </h2>
            <div className="flex flex-col gap-3 mb-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between gap-2 font-sans text-sm"
                >
                  <span className="text-brand-dark/70 truncate flex-1">
                    {`${item.name} × ${item.qty}`}
                  </span>
                  <span className="text-brand-dark shrink-0">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-brand-light pt-4 mb-6">
              <div className="flex justify-between font-serif">
                <span className="text-brand-dark">{"합계"}</span>
                <span className="font-semibold text-brand-dark">
                  {formatPrice(totalPrice())}
                </span>
              </div>
              <p className="font-sans text-xs text-brand-dark/40 mt-1">
                {`배송비: ${totalPrice() >= 30000 ? "무료" : "3,000원"}`}
              </p>
            </div>
            {error && (
              <p className="font-sans text-xs text-red-600 mb-3">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "처리 중..." : "주문 확정"}
            </button>
            <p className="font-sans text-xs text-brand-dark/30 text-center mt-3">
              {"가상 결제 — 실제 결제가 이루어지지 않습니다"}
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
