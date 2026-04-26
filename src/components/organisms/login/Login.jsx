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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await loginUser(formData.email, formData.password);
    
    if (result.success) {
      navigate('/gallery');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-mf-gray py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-black text-mf-black uppercase tracking-tight mb-4">Login</h1>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <span className="text-mf-black">Home</span>
            <span className="text-mf-dark-gray">/</span>
            <span className="text-mf-dark-gray">Login</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-black text-mf-black uppercase tracking-widest">Welcome Back</h2>
          <p className="text-sm text-mf-dark-gray mt-2">Enter your credentials to access your account.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-mf-red/10 border-l-4 border-mf-red text-mf-red text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-mf-black mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-mf"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-mf-black mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-mf"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="w-full btn-mf py-4">
            Sign In
          </button>
        </form>

        <div className="mt-12 text-center pt-8 border-t border-gray-100">
          <p className="text-sm text-mf-dark-gray">Don't have an account?</p>
          <Link to="/register" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest border-b-2 border-mf-black pb-1 hover:text-mf-red hover:border-mf-red transition-all">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;