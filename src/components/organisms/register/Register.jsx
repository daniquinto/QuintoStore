import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerFullUser } from "../../../firebase/auth";
import axios from 'axios';

// Phone validation rules by prefix with flags and placeholders
const PHONE_RULES = {
  '+57': { flag: '🇨🇴', regex: /^3[0-9]{9}$/, label: '10 dígitos (empieza por 3)', placeholder: '3001234567' },
  '+1': { flag: '🇺🇸', regex: /^[0-9]{10}$/, label: '10 digits', placeholder: '2025550123' },
  '+34': { flag: '🇪🇸', regex: /^[67][0-9]{8}$/, label: '9 dígitos (empieza por 6 o 7)', placeholder: '612345678' },
  '+52': { flag: '🇲🇽', regex: /^[0-9]{10}$/, label: '10 dígitos', placeholder: '5512345678' },
  '+54': { flag: '🇦🇷', regex: /^[0-9]{10}$/, label: '10 dígitos', placeholder: '1112345678' },
};

const InputGroup = ({ label, name, type = "text", placeholder, options = null, formData, handleChange, errors, prefix = null }) => (
  <div className="space-y-1">
    <label className="block text-[11px] font-bold uppercase tracking-widest text-mf-black">
      {label}
    </label>
    <div className="relative flex">
      {prefix && (
        <span className="flex items-center px-4 bg-mf-gray border-2 border-r-0 border-mf-gray text-xs font-bold text-mf-black">
          {prefix}
        </span>
      )}
      {options ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          disabled={name === 'city' && !formData.department}
          className={`input-mf appearance-none bg-white ${errors[name] ? 'border-mf-red' : ''}`}
        >
          <option value="">Select {label}</option>
          {options.map(opt => <option key={opt.id || opt.name || opt} value={opt.name || opt}>{opt.name || opt}</option>)}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`input-mf ${errors[name] ? 'border-mf-red' : ''} ${prefix ? 'rounded-l-none' : ''}`}
          placeholder={placeholder}
        />
      )}
    </div>
    {errors[name] && (
      <p className="text-[10px] text-mf-red font-bold uppercase tracking-tighter">{errors[name]}</p>
    )}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cellphone: '',
    phonePrefix: '+57',
    department: '',
    city: '',
    addressDetails: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const [departments, setDepartments] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, cityRes] = await Promise.all([
          axios.get('https://api-colombia.com/api/v1/Department'),
          axios.get('https://api-colombia.com/api/v1/City')
        ]);
        setDepartments(deptRes.data.sort((a, b) => a.name.localeCompare(b.name)));
        setAllCities(cityRes.data);
      } catch (err) {
        setApiError("Error al cargar datos de Colombia.");
      }
    };
    fetchData();
  }, []);

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

  const validateField = (name, value, currentPrefix = formData.phonePrefix) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'El nombre es obligatorio.';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Email inválido.';
        break;
      case 'cellphone':
        const rule = PHONE_RULES[currentPrefix];
        if (rule && !rule.regex.test(value)) {
          error = `Formato inválido para ${currentPrefix}. Req: ${rule.label}`;
        }
        break;
      case 'password':
        if (value.length < 8) error = 'Mínimo 8 caracteres.';
        else if (!/[A-Z]/.test(value)) error = 'Al menos una mayúscula.';
        else if (!/[0-9]/.test(value)) error = 'Al menos un número.';
        break;
      case 'confirmPassword':
        if (value !== formData.password) error = 'Las contraseñas no coinciden.';
        break;
      case 'department':
        if (!value) error = 'Selecciona un departamento.';
        break;
      case 'city':
        if (!value) error = 'Selecciona una ciudad.';
        break;
      case 'addressDetails':
        if (!value.trim()) error = 'Ingresa los detalles.';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'cellphone') {
      newValue = value.replace(/[^0-9]/g, '');
    }

    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: newValue,
        ...(name === 'department' ? { city: '' } : {})
      };
      
      // Dynamic validation
      validateField(name, newValue, updated.phonePrefix);
      
      if (name === 'password') {
        validateField('confirmPassword', updated.confirmPassword, updated.phonePrefix);
      }

      // If prefix changes, re-validate cellphone
      if (name === 'phonePrefix') {
        validateField('cellphone', updated.cellphone, newValue);
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    const formErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) formErrors[key] = error;
    });

    if (Object.values(formErrors).some(err => err !== '')) {
      setErrors(formErrors);
      setApiError('Por favor corrige los errores antes de continuar.');
      return;
    }

    setLoading(true);
    try {
      const fullAddress = `${formData.addressDetails}, ${formData.city}, ${formData.department}, Colombia`;
      const fullPhone = `${formData.phonePrefix} ${formData.cellphone}`;
      const submissionData = { ...formData, address: fullAddress, cellphone: fullPhone };
      const respuesta = await registerFullUser(submissionData);
      if (respuesta.success) {
        navigate('/login');
      } else {
        setApiError(`Error: ${respuesta.error}`);
      }
    } catch (err) {
      setApiError('Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-mf-gray py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-black text-mf-black uppercase tracking-tight mb-4">Register</h1>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-mf-dark-gray">
            <span className="text-mf-black">Home</span> / Register
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-black text-mf-black uppercase tracking-widest">Create Account</h2>
        </div>

        {apiError && (
          <div className="mb-8 p-4 bg-mf-red/10 border-l-4 border-mf-red text-mf-red text-[11px] font-bold uppercase tracking-widest">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* General Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <InputGroup label="Full Name" name="name" placeholder="John Doe" formData={formData} handleChange={handleChange} errors={errors} />
            </div>
            <InputGroup label="Email Address" name="email" type="email" placeholder="email@example.com" formData={formData} handleChange={handleChange} errors={errors} />
            
            <div className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-mf-black">Cellphone</label>
              <div className="flex">
                <select 
                  name="phonePrefix" 
                  value={formData.phonePrefix} 
                  onChange={handleChange} 
                  className="bg-mf-gray border-2 border-r-0 border-mf-gray text-sm font-bold px-3 outline-none focus:border-mf-black transition-colors"
                >
                  {Object.entries(PHONE_RULES).map(([pref, rule]) => (
                    <option key={pref} value={pref}>
                      {rule.flag} {pref}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="cellphone"
                  value={formData.cellphone}
                  onChange={handleChange}
                  className={`input-mf ${errors.cellphone ? 'border-mf-red' : ''}`}
                  placeholder={PHONE_RULES[formData.phonePrefix]?.placeholder || "1234567890"}
                />
              </div>
              {errors.cellphone && (
                <p className="text-[10px] text-mf-red font-bold uppercase tracking-tighter">{errors.cellphone}</p>
              )}
            </div>
          </div>

          {/* Address Section */}
          <div className="pt-8 border-t border-gray-100">
            <div className="flex justify-between items-end mb-8">
              <h3 className="text-sm font-black uppercase tracking-widest text-mf-black">Shipping Address</h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-mf-red bg-mf-red/5 px-2 py-1">
                🇨🇴 Colombia Only
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputGroup label="Department" name="department" options={departments} formData={formData} handleChange={handleChange} errors={errors} />
              <InputGroup label="City" name="city" options={filteredCities} formData={formData} handleChange={handleChange} errors={errors} />
              <div className="md:col-span-2">
                <InputGroup label="Street Address / Details" name="addressDetails" placeholder="Avenue 123 #45-67" formData={formData} handleChange={handleChange} errors={errors} />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="pt-8 border-t border-gray-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-mf-black mb-8">Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputGroup label="Password" name="password" type="password" placeholder="••••••••" formData={formData} handleChange={handleChange} errors={errors} />
              <InputGroup label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••" formData={formData} handleChange={handleChange} errors={errors} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full btn-mf py-5 flex items-center justify-center gap-3 ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : 'Register Now'}
          </button>
        </form>

        <div className="mt-12 text-center pt-8 border-t border-gray-100">
          <p className="text-sm text-mf-dark-gray">Already have an account? <Link to="/login" className="text-mf-black font-black uppercase tracking-widest border-b-2 border-mf-black hover:text-mf-red hover:border-mf-red transition-all">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;