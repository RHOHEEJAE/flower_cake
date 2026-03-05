"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils"

const STATUSES = ["pending", "preparing", "shipping", "delivered", "cancelled"]
const STATUS_LABEL: Record<string, string> = {
  pending: "주문접수",
  preparing: "준비중",
  shipping: "배송중",
  delivered: "배송완료",
  cancelled: "취소",
}
const STATUS_BADGE: Record<string, string> = {
  pending: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  shipping: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

export default function AdminOrderList() {
  const supabase = createClient()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleStatusChange = async (orderId: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", orderId)
    load()
  }

  return (
    <main className="flex-1 overflow-auto p-6">
      <h1 className="font-serif text-xl text-brand-dark mb-6">{"주문 목록"}</h1>

      <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-brand-terra border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full font-sans text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["주문번호", "주문일", "고객명", "상품", "금액", "상태", "관리"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    {"주문이 없습니다."}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(order.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-3 text-brand-dark">
                      {order.recipient_name || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[160px] truncate">
                      {order.items?.map((i: any) => i.name).join(", ")}
                    </td>
                    <td className="px-4 py-3 font-serif text-brand-dark">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 ${STATUS_BADGE[order.status] || ""}`}>
                        {STATUS_LABEL[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-xs border border-brand-light px-2 py-1 focus:outline-none"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}
