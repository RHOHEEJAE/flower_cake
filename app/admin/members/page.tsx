"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AdminMemberList() {
  const supabase = createClient()
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
      setMembers(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <main className="flex-1 overflow-auto p-6">
      <h1 className="font-serif text-xl text-brand-dark mb-6">{"회원 관리"}</h1>

      <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-brand-terra border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full font-sans text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["번호", "이름", "이메일", "전화번호", "가입일", "관리자"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    {"회원이 없습니다."}
                  </td>
                </tr>
              ) : (
                members.map((member, i) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3 text-brand-dark">{member.name || "-"}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{member.email || "-"}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{member.phone || "-"}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(member.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-3">
                      {member.is_admin ? (
                        <span className="text-xs px-2 py-0.5 bg-brand-terra/10 text-brand-terra">
                          {"관리자"}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">{"일반"}</span>
                      )}
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
