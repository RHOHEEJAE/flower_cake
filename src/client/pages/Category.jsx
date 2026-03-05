import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import api from '../../lib/api';

const CATEGORY_INFO = {
  sanggyeonrye: { name: '상견례', desc: '첫 만남의 격식과 정성을 담은 선물 세트', seed: 'sanggyeonrye' },
  birthday: { name: '환갑·칠순', desc: '장수와 감사를 담은 고급 화과자', seed: 'birthday' },
  dol: { name: '돌잔치', desc: '아이의 첫 생일을 축하하는 귀여운 디자인', seed: 'dol' },
  wedding: { name: '결혼·웨딩', desc: '두 사람의 시작을 축하하는 우아한 세트', seed: 'wedding' },
  holiday: { name: '명절·제사', desc: '추석·설날 전통 화과자', seed: 'holiday' },
  corporate: { name: '기업·답례품', desc: '로고 각인 가능한 단체 주문용', seed: 'corporate' },
  seasonal: { name: '계절 한정', desc: '봄·여름·가을·겨울 시즌 특별 화과자', seed: 'seasonal' },
  'gift-set': { name: '선물 세트', desc: '2종·5종·10종 혼합 구성', seed: 'giftset' },
};

const SORT_OPTIONS = [
  { value: 'newest', label: '신상품순' },
  { value: 'price_asc', label: '가격 낮은순' },
  { value: 'price_desc', label: '가격 높은순' },
];

export default function Category() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  const info = CATEGORY_INFO[slug] || { name: slug, desc: '', seed: slug };

  useEffect(() => {
    setLoading(true);
    api.get(`/products?category=${slug}&sort=${sort}`)
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [slug, sort]);

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header />

      {/* 카테고리 헤더 */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${info.seed}/1200/400`}
          alt={info.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-3xl md:text-4xl text-white tracking-widest mb-2">{info.name}</h1>
          <p className="font-sans text-sm text-white/70">{info.desc}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 필터 바 */}
        <div className="flex items-center justify-between mb-8">
          <p className="font-sans text-sm text-brand-dark/50">
            총 <span className="text-brand-dark font-medium">{products.length}</span>개 상품
          </p>
          <div className="flex gap-2">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`font-sans text-xs px-3 py-1.5 border transition-colors ${
                  sort === opt.value
                    ? 'bg-brand-dark text-brand-cream border-brand-dark'
                    : 'border-brand-light text-brand-dark hover:border-brand-terra'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 상품 그리드 */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-brand-terra border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-brand-dark/40 text-lg mb-2">상품이 없습니다</p>
            <p className="font-sans text-sm text-brand-dark/30">현재 준비 중인 상품입니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
