import ProductCard from './ProductCard';

export default function RelatedProducts({ products }) {
  if (!products || products.length === 0) return null;
  return (
    <section className="mt-16">
      <h2 className="section-title">관련 상품</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
