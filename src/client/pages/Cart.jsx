import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useCartStore from '../../store/useCartStore';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <p className="font-serif text-2xl text-brand-dark/40 mb-4">장바구니가 비어있습니다</p>
          <p className="font-sans text-sm text-brand-dark/30 mb-8">마음에 드는 화과자를 담아보세요.</p>
          <button onClick={() => navigate('/')} className="btn-primary text-sm">
            쇼핑 계속하기
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="section-title">장바구니</h1>

        <div className="space-y-4 mb-8">
          {items.map(item => (
            <div key={item.productId} className="bg-white border border-brand-light p-4 flex gap-4 items-start">
              <img
                src={item.image || `https://picsum.photos/seed/${item.productId}/120/120`}
                alt={item.name}
                className="w-20 h-20 object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-sm text-brand-dark mb-2 truncate">{item.name}</h3>
                <p className="font-serif text-base font-semibold text-brand-dark">{item.price.toLocaleString()}원</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={() => removeItem(item.productId)}
                  className="font-sans text-xs text-brand-dark/30 hover:text-red-500 transition-colors"
                >
                  삭제
                </button>
                <div className="flex items-center border border-brand-light">
                  <button onClick={() => updateQty(item.productId, item.qty - 1)} className="px-2 py-1 text-brand-dark hover:bg-brand-cream">-</button>
                  <span className="px-3 py-1 font-sans text-sm border-x border-brand-light">{item.qty}</span>
                  <button onClick={() => updateQty(item.productId, item.qty + 1)} className="px-2 py-1 text-brand-dark hover:bg-brand-cream">+</button>
                </div>
                <p className="font-serif text-sm font-semibold text-brand-terra">
                  {(item.price * item.qty).toLocaleString()}원
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 합계 */}
        <div className="bg-brand-cream/40 border border-brand-light p-6 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-sans text-sm text-brand-dark/60">주문 합계</span>
            <span className="font-serif text-xl font-semibold text-brand-dark">{totalPrice().toLocaleString()}원</span>
          </div>
          <p className="font-sans text-xs text-brand-dark/40 mt-1">3만원 이상 무료 배송</p>
        </div>

        <div className="flex gap-3">
          <button onClick={clearCart} className="btn-outline text-sm flex-none">
            전체 삭제
          </button>
          <button onClick={() => navigate('/checkout')} className="flex-1 btn-primary text-sm">
            주문하기
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
