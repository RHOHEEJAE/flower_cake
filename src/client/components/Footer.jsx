import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-cream mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-xl tracking-widest mb-4">花菓子</h3>
            <p className="font-sans text-sm text-brand-cream/70 leading-relaxed">
              전통의 맛과 현대적 감각이 만나는<br />수제 화과자 브랜드입니다.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-sm tracking-wider mb-4 text-brand-cream/80">테마 선물</h4>
            <div className="grid grid-cols-2 gap-y-2">
              {[['상견례', 'sanggyeonrye'], ['환갑·칠순', 'birthday'], ['돌잔치', 'dol'], ['결혼·웨딩', 'wedding'], ['명절·제사', 'holiday'], ['계절 한정', 'seasonal']].map(([name, slug]) => (
                <Link key={slug} to={`/category/${slug}`} className="font-sans text-xs text-brand-cream/60 hover:text-brand-terra transition-colors">
                  {name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-serif text-sm tracking-wider mb-4 text-brand-cream/80">고객 안내</h4>
            <div className="space-y-2">
              <p className="font-sans text-xs text-brand-cream/60">주문 문의: 02-0000-0000</p>
              <p className="font-sans text-xs text-brand-cream/60">이메일: info@wagashi.kr</p>
              <p className="font-sans text-xs text-brand-cream/60">운영시간: 평일 10:00 ~ 18:00</p>
            </div>
          </div>
        </div>
        <div className="border-t border-brand-cream/20 mt-8 pt-6 text-center">
          <p className="font-sans text-xs text-brand-cream/40">
            © 2025 花菓子 수제 화과자. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
