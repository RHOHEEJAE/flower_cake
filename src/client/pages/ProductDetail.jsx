import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RelatedProducts from '../components/RelatedProducts';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';
import api from '../../lib/api';

const TABS = ['상세 정보', '배송 안내', '교환·환불'];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const addItem = useCartStore(s => s.addItem);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(res => { setData(res.data); setActiveImg(0); })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!isLoggedIn()) { setShowLoginModal(true); return; }
    addItem(data.product, qty);
    alert(`"${data.product.name}"을 장바구니에 담았습니다.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-terra border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;
  const { product, related } = data;
  const images = product.images && product.images.length > 0 ? product.images : [`https://picsum.photos/seed/${product.id}/600/600`];

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* 이미지 갤러리 */}
          <div>
            <div className="aspect-square overflow-hidden bg-brand-cream/30 mb-3">
              <img
                src={images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-brand-terra' : 'border-brand-light'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 상품 정보 */}
          <div>
            <div className="mb-2">
              <span className="font-sans text-xs text-brand-terra">{product.category_slug}</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl text-brand-dark mb-4 leading-relaxed">{product.name}</h1>

            {/* 태그 */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex gap-1 mb-4 flex-wrap">
                {product.tags.map(tag => (
                  <span key={tag} className="text-xs font-sans text-brand-terra border border-brand-terra px-2 py-0.5"># {tag}</span>
                ))}
              </div>
            )}

            <div className="text-3xl font-serif font-semibold text-brand-dark mb-4">
              {product.price.toLocaleString()}원
            </div>

            {/* 재고 상태 */}
            <div className="mb-6">
              {product.stock === 0 ? (
                <span className="font-sans text-sm text-red-600">품절</span>
              ) : product.stock <= 5 ? (
                <span className="font-sans text-sm text-orange-600">소량 남음 ({product.stock}개)</span>
              ) : (
                <span className="font-sans text-sm text-green-700">재고 있음</span>
              )}
            </div>

            {/* 수량 선택 */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <span className="font-sans text-sm text-brand-dark/60">수량</span>
                <div className="flex items-center border border-brand-light">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-brand-dark hover:bg-brand-cream transition-colors">
                    -
                  </button>
                  <span className="px-4 py-2 font-sans text-sm text-brand-dark border-x border-brand-light">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-2 text-brand-dark hover:bg-brand-cream transition-colors">
                    +
                  </button>
                </div>
              </div>
            )}

            {/* 장바구니 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? '품절' : '장바구니 담기'}
              </button>
            </div>

            {/* 간단 정보 */}
            <div className="mt-8 border-t border-brand-light pt-6 space-y-3">
              {product.storage && (
                <div className="flex gap-4 font-sans text-sm">
                  <span className="text-brand-dark/40 w-20 shrink-0">보관 방법</span>
                  <span className="text-brand-dark">{product.storage}</span>
                </div>
              )}
              {product.shelf_life && (
                <div className="flex gap-4 font-sans text-sm">
                  <span className="text-brand-dark/40 w-20 shrink-0">유통기한</span>
                  <span className="text-brand-dark">{product.shelf_life}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 상세 탭 */}
        <div className="mt-16">
          <div className="flex border-b border-brand-light">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`font-sans text-sm px-6 py-3 border-b-2 transition-colors -mb-px ${
                  activeTab === i ? 'border-brand-terra text-brand-terra' : 'border-transparent text-brand-dark/50 hover:text-brand-dark'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="py-8 font-sans text-sm text-brand-dark/70 leading-8">
            {activeTab === 0 && (
              <div className="space-y-4">
                <p>{product.description}</p>
                {product.ingredients && (
                  <div className="mt-4 p-4 bg-brand-cream/30">
                    <p className="font-medium text-brand-dark mb-1">재료</p>
                    <p>{product.ingredients}</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === 1 && (
              <div className="space-y-3">
                <p>• 주문 후 1~2일 내 출고됩니다 (주말·공휴일 제외).</p>
                <p>• 신선한 상품을 위해 아이스팩과 함께 배송됩니다.</p>
                <p>• 배송비: 3만원 이상 무료배송, 미만 시 3,000원</p>
                <p>• 제주 및 도서산간 지역은 추가 배송비가 부과될 수 있습니다.</p>
              </div>
            )}
            {activeTab === 2 && (
              <div className="space-y-3">
                <p>• 식품 특성상 단순 변심에 의한 교환·환불은 불가합니다.</p>
                <p>• 상품 불량 또는 오배송의 경우 수령 후 24시간 이내 연락 주세요.</p>
                <p>• 문의: 02-0000-0000 / info@wagashi.kr</p>
              </div>
            )}
          </div>
        </div>

        {/* 관련 상품 */}
        <RelatedProducts products={related} />
      </div>

      {/* 비로그인 모달 */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-8 max-w-sm w-full text-center">
            <h3 className="font-serif text-lg text-brand-dark mb-3">로그인이 필요합니다</h3>
            <p className="font-sans text-sm text-brand-dark/60 mb-6">장바구니를 이용하려면 로그인해 주세요.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 btn-outline text-sm"
              >
                취소
              </button>
              <button
                onClick={() => navigate('/login?redirect=/cart')}
                className="flex-1 btn-primary text-sm"
              >
                로그인
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
