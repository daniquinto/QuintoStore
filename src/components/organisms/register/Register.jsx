import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerFullUser } from "../../../firebase/auth"

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cellphone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const respuesta = await registerFullUser(formData);

    if (respuesta.success) {
      navigate('/login');
    } else {
      setError(respuesta.error);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-mf-gray py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-black text-mf-black uppercase tracking-tight mb-4">Register</h1>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <span className="text-mf-black">Home</span>
            <span className="text-mf-dark-gray">/</span>
            <span className="text-mf-dark-gray">Register</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-black text-mf-black uppercase tracking-widest">Create Account</h2>
          <p className="text-sm text-mf-dark-gray mt-2">Join MaleFashion and get the best experience.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-mf-red/10 border-l-4 border-mf-red text-mf-red text-xs font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-mf-black mb-2">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-mf" placeholder="John Doe" required />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-mf-black mb-2">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-mf" placeholder="email@example.com" required />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-mf-black mb-2">Cellphone</label>
            <input type="text" name="cellphone" value={formData.cellphone} onChange={handleChange} className="input-mf" placeholder="+57 300..." required />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-mf-black mb-2">Shipping Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-mf" placeholder="Street 123, City" required />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-mf-black mb-2">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-mf" placeholder="••••••••" required />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-mf-black mb-2">Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-mf" placeholder="••••••••" required />
          </div>

          <button type="submit" className="md:col-span-2 btn-mf py-4 mt-4">
            Register Now
          </button>
        </form>

        <div className="mt-12 text-center pt-8 border-t border-gray-100">
          <p className="text-sm text-mf-dark-gray">Already have an account?</p>
          <Link to="/login" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest border-b-2 border-mf-black pb-1 hover:text-mf-red hover:border-mf-red transition-all">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;