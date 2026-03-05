import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { adminApi } from '../../lib/api';

const STATUSES = ['주문접수', '준비중', '배송중', '배송완료', '취소'];

const STATUS_COLOR = {
  '주문접수': 'bg-blue-100 text-blue-700',
  '준비중': 'bg-orange-100 text-orange-700',
  '배송중': 'bg-purple-100 text-purple-700',
  '배송완료': 'bg-green-100 text-green-700',
  '취소': 'bg-red-100 text-red-700',
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    adminApi.get(`/orders/${id}`)
      .then(res => { setOrder(res.data); setStatus(res.data.status); })
      .catch(() => navigate('/admin/orders'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusSave = async () => {
    setSaving(true);
    try {
      const res = await adminApi.patch(`/orders/${id}/status`, { status });
      setOrder(res.data);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-brand-terra border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="주문 상세" />
        <main className="flex-1 overflow-auto p-6">
          <button onClick={() => navigate('/admin/orders')} className="font-sans text-sm text-brand-dark/50 hover:text-brand-terra mb-6 flex items-center gap-1">
            ← 목록으로
          </button>

          <div className="max-w-2xl space-y-4">
            {/* 주문 기본 정보 */}
            <div className="bg-white border border-gray-100 p-6">
              <h3 className="font-serif text-sm text-brand-dark border-b border-gray-100 pb-3 mb-4">주문 정보</h3>
              <div className="space-y-3 font-sans text-sm">
                {[
                  ['주문번호', order.id.slice(0, 8).toUpperCase()],
                  ['주문일', new Date(order.created_at).toLocaleString('ko-KR')],
                  ['받는 분', order.customer_name],
                  ['연락처', order.phone],
                  ['배송지', order.address],
                  ['메모', order.memo || '-'],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-4">
                    <span className="text-gray-400 w-20 shrink-0">{label}</span>
                    <span className="text-brand-dark">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 주문 상품 */}
            <div className="bg-white border border-gray-100 p-6">
              <h3 className="font-serif text-sm text-brand-dark border-b border-gray-100 pb-3 mb-4">주문 상품</h3>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between font-sans text-sm">
                    <span className="text-brand-dark">{item.name} × {item.qty}</span>
                    <span className="font-serif text-brand-dark">{(item.price * item.qty).toLocaleString()}원</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-serif font-semibold text-brand-dark">
                  <span>합계</span>
                  <span>{order.total_price.toLocaleString()}원</span>
                </div>
              </div>
            </div>

            {/* 상태 변경 */}
            <div className="bg-white border border-gray-100 p-6">
              <h3 className="font-serif text-sm text-brand-dark border-b border-gray-100 pb-3 mb-4">배송 상태</h3>
              <div className="flex items-center gap-3">
                <span className={`text-sm px-3 py-1 ${STATUS_COLOR[order.status] || ''}`}>{order.status}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="border border-brand-light px-3 py-2 font-sans text-sm focus:outline-none focus:border-brand-terra"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  onClick={handleStatusSave}
                  disabled={saving || status === order.status}
                  className="btn-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? '저장 중...' : '상태 변경'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
