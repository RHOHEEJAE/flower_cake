import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';
import api from '../../lib/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, totalPrice, clearCart } = useCartStore();
  const [form, setForm] = useState({
    customer_name: user?.nickname || '',
    phone: user?.phone || '',
    address: user?.default_address || '',
    memo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) {
    navigate('/cart', { replace: true });
    return null;
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.customer_name || !form.phone || !form.address) {
      setError('필수 항목을 모두 입력해 주세요.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/orders', {
        ...form,
        items: items.map(i => ({ productId: i.productId, name: i.name, qty: i.qty, price: i.price })),
      });
      clearCart();
      navigate(`/order-complete/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || '주문 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="section-title">주문 / 결제</h1>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-8">
          {/* 배송 정보 */}
          <div className="md:col-span-3 space-y-4">
            <div className="bg-white border border-brand-light p-6">
              <h2 className="font-serif text-base text-brand-dark mb-4">배송 정보</h2>
              <div className="space-y-4">
                {[
                  { name: 'customer_name', label: '받는 분 *', type: 'text', placeholder: '이름을 입력하세요' },
                  { name: 'phone', label: '연락처 *', type: 'tel', placeholder: '010-0000-0000' },
                  { name: 'address', label: '배송지 *', type: 'text', placeholder: '배송지 주소를 입력하세요' },
                  { name: 'memo', label: '배송 메모', type: 'text', placeholder: '예) 선물 포장 요청' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block font-sans text-xs text-brand-dark/60 mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm text-brand-dark focus:outline-none focus:border-brand-terra"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 주문 요약 */}
          <div className="md:col-span-2">
            <div className="bg-white border border-brand-light p-6 sticky top-20">
              <h2 className="font-serif text-base text-brand-dark mb-4">주문 상품</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.productId} className="flex justify-between gap-2 font-sans text-sm">
                    <span className="text-brand-dark/70 truncate flex-1">{item.name} × {item.qty}</span>
                    <span className="text-brand-dark shrink-0">{(item.price * item.qty).toLocaleString()}원</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-brand-light pt-4 mb-6">
                <div className="flex justify-between font-serif">
                  <span className="text-brand-dark">합계</span>
                  <span className="font-semibold text-brand-dark">{totalPrice().toLocaleString()}원</span>
                </div>
                <p className="font-sans text-xs text-brand-dark/40 mt-1">
                  배송비: {totalPrice() >= 30000 ? '무료' : '3,000원'}
                </p>
              </div>
              {error && <p className="font-sans text-xs text-red-600 mb-3">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? '처리 중...' : '주문 확정'}
              </button>
              <p className="font-sans text-xs text-brand-dark/30 text-center mt-3">
                가상 결제 — 실제 결제가 이루어지지 않습니다
              </p>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
