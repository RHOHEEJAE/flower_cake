import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, fetchUser } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
      fetchUser().then(() => {
        const redirect = sessionStorage.getItem('loginRedirect') || '/';
        sessionStorage.removeItem('loginRedirect');
        navigate(redirect, { replace: true });
      });
    } else {
      navigate('/login?error=callback', { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-brand-terra border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif text-brand-dark/60 text-sm">로그인 처리 중...</p>
      </div>
    </div>
  );
}
