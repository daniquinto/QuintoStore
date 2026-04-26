import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import useUserStore from '../store/userStore';
import { loginUser } from '../firebase/auth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if there's a redirect parameter
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await loginUser(formData.email, formData.password);
      if (result.success) {
        // Redirect to intended page or gallery
        navigate(redirectTo ? `/${redirectTo}` : '/gallery');
      } else {
        setError(result.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-quinto-50/30 min-h-screen py-24 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 quinto-card p-12 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-quinto-500/5 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-quinto-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-quinto-900/10">
              <svg className="w-8 h-8 text-quinto-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-quinto-900 uppercase">
              {redirectTo === 'checkout' ? 'Login to Purchase' : 'Welcome Back'}
            </h1>
            <p className="text-xs font-bold text-quinto-400 uppercase tracking-[0.3em] mt-2">Sign in to Quinto Store</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 text-[10px] font-black uppercase tracking-widest">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-quinto-600">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="quinto-input"
                placeholder="john@quinto.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-quinto-600">Password</label>
                <a href="#" className="text-[10px] font-black uppercase tracking-widest text-quinto-500 hover:text-quinto-900 transition-colors">Forgot?</a>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="quinto-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="w-full quinto-btn-primary py-4 shadow-xl shadow-quinto-900/10 mt-6">
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : 'SIGN IN'}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-xs text-quinto-400 font-bold uppercase tracking-widest leading-loose">
              Not a member yet?<br />
              <Link to={`/register${redirectTo ? '?redirect='+redirectTo : ''}`} className="text-quinto-900 border-b-2 border-quinto-500 hover:text-quinto-500 transition-all">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;