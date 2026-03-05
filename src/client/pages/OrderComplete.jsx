import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../../lib/api';

export default function OrderComplete() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${orderId}`)
      .then(res => setOrder(res.data))
      .catch(() => navigate('/'));
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-terra border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header />
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-terra/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-brand-terra" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-serif text-2xl text-brand-dark mb-2">주문이 완료되었습니다</h1>
        <p className="font-sans text-sm text-brand-dark/50 mb-8">정성을 담아 준비하겠습니다.</p>

        <div className="bg-white border border-brand-light p-6 text-left mb-6">
          <div className="space-y-3 font-sans text-sm">
            <div className="flex justify-between">
              <span className="text-brand-dark/50">주문번호</span>
              <span className="text-brand-dark font-mono text-xs">{order.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-dark/50">받는 분</span>
              <span className="text-brand-dark">{order.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-dark/50">배송지</span>
              <span className="text-brand-dark text-right max-w-[60%]">{order.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-dark/50">상품</span>
              <span className="text-brand-dark">{order.items.map(i => i.name).join(', ')}</span>
            </div>
            <div className="border-t border-brand-light pt-3 flex justify-between font-semibold">
              <span className="text-brand-dark">합계</span>
              <span className="font-serif text-brand-dark">{order.total_price.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-dark/50">상태</span>
              <span className="text-brand-terra">{order.status}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/mypage" className="flex-1 btn-outline text-sm">주문 내역 보기</Link>
          <Link to="/" className="flex-1 btn-primary text-sm">계속 쇼핑하기</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
