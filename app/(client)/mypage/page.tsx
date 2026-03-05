"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils"
import type { User } from "@supabase/supabase-js"

const STATUS_COLOR: Record<string, string> = {
  pending: "text-blue-600",
  preparing: "text-orange-600",
  shipping: "text-purple-600",
  delivered: "text-green-700",
  cancelled: "text-red-600",
}

const STATUS_LABEL: Record<string, string> = {
  pending: "주문접수",
  preparing: "준비중",
  shipping: "배송중",
  delivered: "배송완료",
  cancelled: "취소",
}

export default function MyPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [form, setForm] = useState({ phone: "", address: "" })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      if (profileData) {
        setProfile(profileData)
        setForm({
          phone: profileData.phone || "",
          address: profileData.address || "",
        })
      }

      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      setOrders(ordersData || [])
    }
    load()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    await supabase.from("profiles").update(form).eq("id", user.id)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    setSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (!user || !profile) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-2 border-brand-terra border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="section-title">{"마이페이지"}</h1>

      {/* Profile */}
      <div className="bg-white border border-brand-light p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-brand-cream flex items-center justify-center font-serif text-xl text-brand-dark">
            {profile.name?.charAt(0) || "?"}
          </div>
          <div>
            <span className="font-serif text-lg text-brand-dark">
              {profile.name}
            </span>
            <p className="font-sans text-xs text-brand-dark/40">
              {profile.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="block font-sans text-xs text-brand-dark/60 mb-1">
              {"전화번호"}
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="010-0000-0000"
              className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-terra"
            />
          </div>
          <div>
            <label className="block font-sans text-xs text-brand-dark/60 mb-1">
              {"기본 배송지"}
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              placeholder="기본 배송지를 입력하세요"
              className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-terra"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-sm disabled:opacity-60"
            >
              {saving ? "저장 중..." : "정보 저장"}
            </button>
            {saved && (
              <span className="font-sans text-xs text-green-700">
                {"저장되었습니다."}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Orders */}
      <div className="bg-white border border-brand-light p-6 mb-6">
        <h2 className="font-serif text-base text-brand-dark mb-4">
          {"주문 내역"}
        </h2>
        {orders.length === 0 ? (
          <p className="font-sans text-sm text-brand-dark/40 text-center py-8">
            {"주문 내역이 없습니다."}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-brand-light p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-sans text-xs text-brand-dark/40 mb-1">
                      {`${new Date(order.created_at).toLocaleDateString("ko-KR")} · ${order.id.slice(0, 8).toUpperCase()}`}
                    </p>
                    <p className="font-sans text-sm text-brand-dark">
                      {order.items.map((i: any) => i.name).join(", ")}
                    </p>
                  </div>
                  <span
                    className={`font-sans text-xs shrink-0 ${STATUS_COLOR[order.status] || "text-brand-dark"}`}
                  >
                    {STATUS_LABEL[order.status] || order.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-semibold text-brand-dark">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full border border-brand-light font-sans text-sm text-brand-dark/60 py-3 hover:bg-brand-cream transition-colors"
      >
        {"로그아웃"}
      </button>
    </div>
  )
}
