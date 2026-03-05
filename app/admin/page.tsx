"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { formatPrice } from "@/lib/utils"

export default function AdminDashboard() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    lowStockCount: 0,
    totalMembers: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      // Orders count & total
      const { data: orders } = await supabase
        .from("orders")
        .select("id, total_amount, status, recipient_name, items, created_at")
        .order("created_at", { ascending: false })

      const totalOrders = orders?.length || 0
      const totalSales = orders?.reduce((s, o) => s + o.total_amount, 0) || 0
      setRecentOrders(orders?.slice(0, 5) || [])

      // Low stock count
      const { count: lowStockCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .lte("stock", 5)

      // Members count
      const { count: totalMembers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })

      setStats({
        totalOrders,
        totalSales,
        lowStockCount: lowStockCount || 0,
        totalMembers: totalMembers || 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  const STATUS_BADGE: Record<string, string> = {
    pending: "bg-blue-100 text-blue-700",
    preparing: "bg-orange-100 text-orange-700",
    shipping: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  }

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-terra border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-auto p-6">
      <h1 className="font-serif text-xl text-brand-dark mb-6">{"대시보드"}</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "총 주문", value: `${stats.totalOrders}건`, color: "text-blue-600" },
          { label: "총 매출", value: formatPrice(stats.totalSales), color: "text-green-700" },
          { label: "재고 부족", value: `${stats.lowStockCount}개`, color: "text-orange-600" },
          { label: "총 회원", value: `${stats.totalMembers}명`, color: "text-purple-600" },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-gray-100 p-5 shadow-sm">
            <p className="font-sans text-xs text-gray-500 mb-2">{card.label}</p>
            <p className={`font-serif text-2xl font-semibold ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-serif text-sm text-brand-dark">{"최근 주문"}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["주문번호", "고객명", "금액", "상태", "날짜"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    {"주문이 없습니다."}
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-brand-dark">
                      {order.recipient_name || "-"}
                    </td>
                    <td className="px-4 py-3 font-serif text-brand-dark">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 ${STATUS_BADGE[order.status] || ""}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(order.created_at).toLocaleDateString("ko-KR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
