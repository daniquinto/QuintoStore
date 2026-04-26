import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import useUserStore from '../../../store/userStore';
import { loginUser } from '../../../firebase/auth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await loginUser(formData.email, formData.password);
      if (result.success) navigate('/gallery');
      else setError(result.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-quinto-50/30 min-h-screen py-24 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-4 flex flex-col md:flex-row quinto-card overflow-hidden h-[600px]">
        {/* Left Side - Visual */}
        <div className="md:w-1/2 bg-quinto-900 p-16 text-white flex flex-col justify-between relative">
          <div className="absolute top-0 left-0 w-full h-full bg-quinto-500/10 blur-[80px] rounded-full translate-x-[-50%] translate-y-[-50%]"></div>
          <div className="relative z-10">
            <span className="text-quinto-400 text-[10px] font-black uppercase tracking-[0.4em]">WELCOME TO QUINTO</span>
            <h2 className="text-5xl font-black tracking-tighter mt-6 leading-tight uppercase">EXPERIENCE<br />QUALITY.</h2>
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-quinto-300">Quinto Store © 2026</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-16 bg-white flex flex-col justify-center">
          <div className="mb-12">
            <h1 className="text-3xl font-black tracking-tight text-quinto-900 uppercase">Sign In</h1>
            <p className="text-xs font-bold text-quinto-400 uppercase tracking-widest mt-2">Access your premium dashboard</p>
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

            <button type="submit" disabled={loading} className="w-full quinto-btn-primary py-4 mt-6">
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : 'SIGN IN'}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-xs text-quinto-400 font-bold uppercase tracking-widest leading-loose">
              Not a member yet?<br />
              <Link to="/register" className="text-quinto-900 border-b-2 border-quinto-500 hover:text-quinto-500 transition-all">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;