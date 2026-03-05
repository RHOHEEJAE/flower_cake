import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useCartStore from '../../store/useCartStore';

export default function ProductCard({ product }) {
  const { isLoggedIn } = useAuthStore();
  const addItem = useCartStore(s => s.addItem);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      navigate('/login?redirect=/cart');
      return;
    }
    addItem(product);
    alert(`"${product.name}"을 장바구니에 담았습니다.`);
  };

  const stockBadge = () => {
    if (product.stock === 0) return <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 font-sans">품절</span>;
    if (product.stock <= 5) return <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 font-sans">소량 남음</span>;
    return null;
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card group block">
      <div className="aspect-square overflow-hidden bg-brand-cream/30">
        <img
          src={product.images?.[0] || `https://picsum.photos/seed/${product.id}/400/400`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-serif text-sm text-brand-dark leading-tight">{product.name}</h3>
          {stockBadge()}
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="font-serif text-base font-semibold text-brand-dark">
            {product.price.toLocaleString()}원
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="text-xs font-sans bg-brand-dark text-brand-cream px-3 py-1.5 hover:bg-brand-terra transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? '품절' : '담기'}
          </button>
        </div>
        {product.tags && product.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {product.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs text-brand-terra font-sans"># {tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
