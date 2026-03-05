import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { adminApi } from '../../lib/api';

const STATUSES = ['전체', '주문접수', '준비중', '배송중', '배송완료', '취소'];

const STATUS_COLOR = {
  '주문접수': 'bg-blue-100 text-blue-700',
  '준비중': 'bg-orange-100 text-orange-700',
  '배송중': 'bg-purple-100 text-purple-700',
  '배송완료': 'bg-green-100 text-green-700',
  '취소': 'bg-red-100 text-red-700',
};

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', from: '', to: '' });

  const load = () => {
    const params = new URLSearchParams();
    if (filter.status) params.set('status', filter.status);
    if (filter.from) params.set('from', filter.from);
    if (filter.to) params.set('to', filter.to);
    adminApi.get(`/orders?${params}`)
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleStatusChange = async (orderId, status) => {
    await adminApi.patch(`/orders/${orderId}/status`, { status });
    load();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="주문 목록" />
        <main className="flex-1 overflow-auto p-6">
          {/* 필터 */}
          <div className="bg-white border border-gray-100 p-4 mb-4 flex flex-wrap gap-3 items-end">
            <div>
              <label className="block font-sans text-xs text-gray-500 mb-1">상태</label>
              <select
                value={filter.status}
                onChange={e => setFilter(f => ({ ...f, status: e.target.value === '전체' ? '' : e.target.value }))}
                className="border border-brand-light px-3 py-2 font-sans text-sm focus:outline-none focus:border-brand-terra"
              >
                {STATUSES.map(s => <option key={s} value={s === '전체' ? '' : s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-sans text-xs text-gray-500 mb-1">시작일</label>
              <input type="date" value={filter.from} onChange={e => setFilter(f => ({ ...f, from: e.target.value }))}
                className="border border-brand-light px-3 py-2 font-sans text-sm focus:outline-none focus:border-brand-terra" />
            </div>
            <div>
              <label className="block font-sans text-xs text-gray-500 mb-1">종료일</label>
              <input type="date" value={filter.to} onChange={e => setFilter(f => ({ ...f, to: e.target.value }))}
                className="border border-brand-light px-3 py-2 font-sans text-sm focus:outline-none focus:border-brand-terra" />
            </div>
            <button onClick={() => setFilter({ status: '', from: '', to: '' })}
              className="font-sans text-xs text-brand-dark/50 hover:text-brand-terra px-3 py-2 border border-brand-light">
              초기화
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
                    {['주문번호', '주문일', '고객명', '상품', '금액', '상태', '관리'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400">주문이 없습니다.</td></tr>
                  ) : orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{order.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString('ko-KR')}</td>
                      <td className="px-4 py-3 text-brand-dark">{order.customer_name}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs max-w-[160px] truncate">
                        {order.items.map(i => i.name).join(', ')}
                      </td>
                      <td className="px-4 py-3 font-serif text-brand-dark">{order.total_price.toLocaleString()}원</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 ${STATUS_COLOR[order.status] || ''}`}>{order.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 items-center">
                          <select
                            value={order.status}
                            onChange={e => handleStatusChange(order.id, e.target.value)}
                            className="text-xs border border-brand-light px-2 py-1 focus:outline-none"
                          >
                            {STATUSES.filter(s => s !== '전체').map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <Link to={`/admin/orders/${order.id}`} className="text-xs text-brand-terra hover:underline whitespace-nowrap">
                            상세
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
