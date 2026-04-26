import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerFullUser } from "../../../firebase/auth";
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cellphone: '',
    department: '',
    city: '',
    addressDetails: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // States for API data
  const [departments, setDepartments] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  // Fetch Colombia Data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, cityRes] = await Promise.all([
          axios.get('https://api-colombia.com/api/v1/Department'),
          axios.get('https://api-colombia.com/api/v1/City')
        ]);
        
        // Sort alphabetically
        setDepartments(deptRes.data.sort((a, b) => a.name.localeCompare(b.name)));
        setAllCities(cityRes.data);
      } catch (err) {
        console.error("Error fetching Colombia API data:", err);
        setError("Error al cargar datos de Colombia. Por favor recarga la página.");
      }
    };
    fetchData();
  }, []);

  // Filter cities when department changes
  useEffect(() => {
    if (formData.department) {
      const deptId = departments.find(d => d.name === formData.department)?.id;
      if (deptId) {
        const filtered = allCities
          .filter(city => city.departmentId === deptId)
          .sort((a, b) => a.name.localeCompare(b.name));
        setFilteredCities(filtered);
      }
    } else {
      setFilteredCities([]);
    }
  }, [formData.department, departments, allCities]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 1. Cellphone numeric restriction
    if (name === 'cellphone') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (onlyNums.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: onlyNums }));
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset city if department changes
      ...(name === 'department' ? { city: '' } : {})
    }));
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateColombianPhone = (phone) => {
    return /^3[0-9]{9}$/.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(formData.email)) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (!validateColombianPhone(formData.cellphone)) {
      setError('El celular debe ser de 10 dígitos y empezar por 3.');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!formData.department || !formData.city || !formData.addressDetails) {
      setError('Por favor completa todos los campos de dirección.');
      return;
    }

    setLoading(true);
    
    try {
      const fullAddress = `${formData.addressDetails}, ${formData.city}, ${formData.department}, Colombia`;
      const submissionData = {
        ...formData,
        address: fullAddress
      };

      const respuesta = await registerFullUser(submissionData);

      if (respuesta.success) {
        navigate('/login');
      } else {
        setError(`Error: ${respuesta.error}`);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
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

      <div className="max-w-3xl mx-auto px-4 py-24">
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
            <label className="block text-[11px] font-bold uppercase tracking-widest text-mf-black mb-2">Cellphone (10 digits)</label>
            <input 
              type="text" 
              name="cellphone" 
              value={formData.cellphone} 
              onChange={handleChange} 
              className="input-mf" 
              placeholder="3001234567" 
              required 
            />
          </div>

          {/* Dirección Dinámica */}
          <div className="md:col-span-2 border-t border-mf-gray pt-8 mt-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-mf-black mb-6">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-mf-black mb-2">Department</label>
                <select 
                  name="department" 
                  value={formData.department} 
                  onChange={handleChange} 
                  className="input-mf appearance-none bg-white" 
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => <option key={dept.id} value={dept.name}>{dept.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-mf-black mb-2">City</label>
                <select 
                  name="city" 
                  value={formData.city} 
                  onChange={handleChange} 
                  className="input-mf appearance-none bg-white" 
                  required 
                  disabled={!formData.department}
                >
                  <option value="">Select City</option>
                  {filteredCities.map(city => <option key={city.id} value={city.name}>{city.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-mf-black mb-2">Street Address / Details</label>
                <input type="text" name="addressDetails" value={formData.addressDetails} onChange={handleChange} className="input-mf" placeholder="Avenue 123 #45-67, Apt 101" required />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 border-t border-mf-gray pt-8 mt-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-mf-black mb-6">Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-mf-black mb-2">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-mf" placeholder="••••••••" required />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-mf-black mb-2">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-mf" placeholder="••••••••" required />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`md:col-span-2 btn-mf py-5 mt-8 flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : 'Register Now'}
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