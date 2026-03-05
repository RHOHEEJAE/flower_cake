import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useAuthStore from '../../store/useAuthStore';
import api from '../../lib/api';

const STATUS_COLOR = {
  '주문접수': 'text-blue-600',
  '준비중': 'text-orange-600',
  '배송중': 'text-purple-600',
  '배송완료': 'text-green-700',
  '취소': 'text-red-600',
};

export default function MyPage() {
  const navigate = useNavigate();
  const { user, logout, fetchUser } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ phone: '', default_address: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ phone: user.phone || '', default_address: user.default_address || '' });
    }
    api.get('/users/me/orders').then(res => setOrders(res.data)).catch(() => {});
  }, [user]);

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch('/users/me', form);
      await fetchUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const providerBadge = user.provider === 'naver'
    ? <span className="inline-flex items-center gap-1 text-xs font-sans px-2 py-0.5 bg-[#03C75A] text-white">N 네이버</span>
    : <span className="inline-flex items-center gap-1 text-xs font-sans px-2 py-0.5 bg-[#FEE500] text-[#3C1E1E]">K 카카오</span>;

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="section-title">마이페이지</h1>

        {/* 프로필 */}
        <div className="bg-white border border-brand-light p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            {user.profile_image ? (
              <img src={user.profile_image} alt="" className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-brand-cream flex items-center justify-center font-serif text-xl text-brand-dark">
                {user.nickname?.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-serif text-lg text-brand-dark">{user.nickname}</span>
                {providerBadge}
              </div>
              <p className="font-sans text-xs text-brand-dark/40">{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block font-sans text-xs text-brand-dark/60 mb-1">전화번호</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="010-0000-0000"
                className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-terra"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-brand-dark/60 mb-1">기본 배송지</label>
              <input
                type="text"
                value={form.default_address}
                onChange={e => setForm(f => ({ ...f, default_address: e.target.value }))}
                placeholder="기본 배송지를 입력하세요"
                className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-terra"
              />
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-60">
                {saving ? '저장 중...' : '정보 저장'}
              </button>
              {saved && <span className="font-sans text-xs text-green-700">저장되었습니다.</span>}
            </div>
          </form>
        </div>

        {/* 주문 내역 */}
        <div className="bg-white border border-brand-light p-6 mb-6">
          <h2 className="font-serif text-base text-brand-dark mb-4">주문 내역</h2>
          {orders.length === 0 ? (
            <p className="font-sans text-sm text-brand-dark/40 text-center py-8">주문 내역이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border border-brand-light p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-sans text-xs text-brand-dark/40 mb-1">
                        {new Date(order.created_at).toLocaleDateString('ko-KR')} · {order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="font-sans text-sm text-brand-dark">
                        {order.items.map(i => i.name).join(', ')}
                      </p>
                    </div>
                    <span className={`font-sans text-xs shrink-0 ${STATUS_COLOR[order.status] || 'text-brand-dark'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-semibold text-brand-dark">
                      {order.total_price.toLocaleString()}원
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="w-full border border-brand-light font-sans text-sm text-brand-dark/60 py-3 hover:bg-brand-cream transition-colors"
        >
          로그아웃
        </button>
      </div>
      <Footer />
    </div>
  );
}
