import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { adminApi } from '../../lib/api';

const STAT_CARDS = [
  { key: 'todayOrderCount', label: '오늘 주문', unit: '건', color: 'text-blue-600' },
  { key: 'monthSales', label: '이번 달 매출', unit: '원', color: 'text-green-700', format: v => v.toLocaleString() },
  { key: 'lowStockCount', label: '재고 부족 상품', unit: '개', color: 'text-orange-600' },
  { key: 'newMemberCount', label: '신규 회원', unit: '명', color: 'text-purple-600' },
];

const STATUS_COLOR = {
  '주문접수': 'bg-blue-100 text-blue-700',
  '준비중': 'bg-orange-100 text-orange-700',
  '배송중': 'bg-purple-100 text-purple-700',
  '배송완료': 'bg-green-100 text-green-700',
  '취소': 'bg-red-100 text-red-700',
};

const PIE_COLORS = ['#C8744D', '#2C1A0E', '#F5ECD7', '#a0522d', '#deb887', '#8b4513', '#d2691e', '#cd853f'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/admin/dashboard')
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="대시보드" />
        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-brand-terra border-t-transparent rounded-full animate-spin" />
            </div>
          ) : data ? (
            <>
              {/* 통계 카드 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {STAT_CARDS.map(card => (
                  <div key={card.key} className="bg-white border border-gray-100 p-5 shadow-sm">
                    <p className="font-sans text-xs text-gray-500 mb-2">{card.label}</p>
                    <p className={`font-serif text-2xl font-semibold ${card.color}`}>
                      {card.format ? card.format(data[card.key]) : data[card.key]}
                      <span className="font-sans text-sm font-normal text-gray-400 ml-1">{card.unit}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* 차트 */}
              <div className="grid lg:grid-cols-3 gap-6 mb-6">
                {/* 주간 매출 */}
                <div className="lg:col-span-2 bg-white border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-serif text-sm text-brand-dark mb-4">주간 매출 추이</h3>
                  {data.weekSales.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={data.weekSales}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'Noto Sans KR' }} tickFormatter={d => d.slice(5)} />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={v => [`${v.toLocaleString()}원`, '매출']} />
                        <Line type="monotone" dataKey="total" stroke="#C8744D" strokeWidth={2} dot={{ r: 4, fill: '#C8744D' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-gray-400 font-sans text-sm">데이터 없음</div>
                  )}
                </div>

                {/* 카테고리 비율 */}
                <div className="bg-white border border-gray-100 p-5 shadow-sm">
                  <h3 className="font-serif text-sm text-brand-dark mb-4">카테고리별 판매</h3>
                  {data.categorySales.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={data.categorySales} dataKey="count" nameKey="category_name" cx="50%" cy="50%" outerRadius={70}>
                          {data.categorySales.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-gray-400 font-sans text-sm">데이터 없음</div>
                  )}
                </div>
              </div>

              {/* 최근 주문 */}
              <div className="bg-white border border-gray-100 shadow-sm">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-serif text-sm text-brand-dark">최근 주문</h3>
                  <Link to="/admin/orders" className="font-sans text-xs text-brand-terra hover:underline">전체 보기</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full font-sans text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {['주문번호', '고객명', '금액', '상태', '날짜'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.recentOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-mono text-xs text-gray-500">{order.id.slice(0, 8).toUpperCase()}</td>
                          <td className="px-4 py-3 text-brand-dark">{order.customer_name || order.nickname}</td>
                          <td className="px-4 py-3 font-serif text-brand-dark">{order.total_price.toLocaleString()}원</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 ${STATUS_COLOR[order.status] || ''}`}>{order.status}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString('ko-KR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-400 py-20">데이터를 불러올 수 없습니다.</p>
          )}
        </main>
      </div>
    </div>
  );
}
