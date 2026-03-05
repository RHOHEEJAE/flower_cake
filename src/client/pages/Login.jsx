import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

export default function Login() {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const error = searchParams.get('error');

  useEffect(() => {
    if (token) navigate(redirect, { replace: true });
  }, [token]);

  const handleNaver = () => {
    window.location.href = '/api/auth/naver';
  };

  const handleKakao = () => {
    window.location.href = '/api/auth/kakao';
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-brand-dark tracking-widest mb-2">花菓子</h1>
          <p className="font-sans text-xs text-brand-dark/40 tracking-widest uppercase">Handcrafted Wagashi</p>
        </div>

        <div className="bg-white border border-brand-light p-8">
          <h2 className="font-serif text-xl text-brand-dark text-center mb-2">로그인 / 회원가입</h2>
          <p className="font-sans text-xs text-brand-dark/50 text-center mb-8">
            소셜 계정으로 간편하게 시작하세요
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 font-sans text-xs text-center">
              로그인 중 오류가 발생했습니다. 다시 시도해 주세요.
            </div>
          )}

          <div className="space-y-3">
            {/* 네이버 로그인 */}
            <button
              onClick={handleNaver}
              className="w-full flex items-center justify-center gap-3 py-3.5 font-sans font-medium text-sm text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#03C75A' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
              </svg>
              네이버로 시작하기
            </button>

            {/* 카카오 로그인 */}
            <button
              onClick={handleKakao}
              className="w-full flex items-center justify-center gap-3 py-3.5 font-sans font-medium text-sm text-[#3C1E1E] transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#FEE500' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.909c0 2.841 1.636 5.33 4.091 6.818L5 21l5.318-2.864C10.864 18.318 11.432 18.364 12 18.364c5.523 0 10-3.477 10-7.455S17.523 3 12 3z" />
              </svg>
              카카오로 시작하기
            </button>
          </div>

          <p className="font-sans text-xs text-brand-dark/40 text-center mt-6 leading-5">
            주문 및 장바구니 이용 시 로그인이 필요합니다
          </p>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="font-sans text-xs text-brand-dark/40 hover:text-brand-terra transition-colors"
          >
            ← 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
