import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerFullUser } from "../firebase/auth";
import axios from 'axios';

// Phone validation rules by prefix with flags and placeholders
const PHONE_RULES = {
  '+57': { flag: '🇨🇴', regex: /^3[0-9]{9}$/, label: '10 digits (starts with 3)', placeholder: '3001234567' },
  '+1': { flag: '🇺🇸', regex: /^[0-9]{10}$/, label: '10 digits', placeholder: '2025550123' },
  '+34': { flag: '🇪🇸', regex: /^[67][0-9]{8}$/, label: '9 digits (starts with 6 or 7)', placeholder: '612345678' },
  '+52': { flag: '🇲🇽', regex: /^[0-9]{10}$/, label: '10 digits', placeholder: '5512345678' },
  '+54': { flag: '🇦🇷', regex: /^[0-9]{10}$/, label: '10 digits', placeholder: '1112345678' },
};

const InputGroup = ({ label, name, type = "text", placeholder, options = null, formData, handleChange, errors, prefix = null }) => (
  <div className="space-y-2">
    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-quinto-600">
      {label}
    </label>
    <div className="relative flex">
      {prefix && (
        <span className="flex items-center px-4 bg-quinto-50 border-2 border-r-0 border-quinto-50 text-xs font-bold text-quinto-900 rounded-l-xl">
          {prefix}
        </span>
      )}
      {options ? (
        <div className="relative w-full">
          <select
            name={name}
            value={formData[name]}
            onChange={handleChange}
            disabled={name === 'city' && !formData.department}
            className={`quinto-input appearance-none bg-white pr-10 ${errors[name] ? 'border-red-500' : ''}`}
          >
            <option value="">Select {label}</option>
            {options.map(opt => <option key={opt.id || opt.name || opt} value={opt.name || opt}>{opt.name || opt}</option>)}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-quinto-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`quinto-input ${errors[name] ? 'border-red-500' : ''} ${prefix ? 'rounded-l-none' : ''}`}
          placeholder={placeholder}
        />
      )}
    </div>
    {errors[name] && (
      <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors[name]}</p>
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
        setApiError("Connection issue with Colombia API.");
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
        if (!value.trim()) error = 'Name is required.';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email address.';
        break;
      case 'cellphone':
        const rule = PHONE_RULES[currentPrefix];
        if (rule && !rule.regex.test(value)) {
          error = `Invalid for ${currentPrefix}. Need: ${rule.label}`;
        }
        break;
      case 'password':
        if (value.length < 8) error = 'Min 8 characters.';
        else if (!/[A-Z]/.test(value)) error = 'Need 1 uppercase.';
        else if (!/[0-9]/.test(value)) error = 'Need 1 number.';
        break;
      case 'confirmPassword':
        if (value !== formData.password) error = 'Passwords do not match.';
        break;
      case 'department':
        if (!value) error = 'Select state.';
        break;
      case 'city':
        if (!value) error = 'Select city.';
        break;
      case 'addressDetails':
        if (!value.trim()) error = 'Address details missing.';
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
      validateField(name, newValue, updated.phonePrefix);
      if (name === 'password') validateField('confirmPassword', updated.confirmPassword, updated.phonePrefix);
      if (name === 'phonePrefix') validateField('cellphone', updated.cellphone, newValue);
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
      setApiError('Correct errors before proceeding.');
      return;
    }
    setLoading(true);
    try {
      const fullAddress = `${formData.addressDetails}, ${formData.city}, ${formData.department}, Colombia`;
      const fullPhone = `${formData.phonePrefix} ${formData.cellphone}`;
      const submissionData = { ...formData, address: fullAddress, cellphone: fullPhone };
      const respuesta = await registerFullUser(submissionData);
      if (respuesta.success) navigate('/login');
      else setApiError(`Error: ${respuesta.error}`);
    } catch (err) {
      setApiError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-quinto-50/30 min-h-screen py-24 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4 quinto-card p-12 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-quinto-500/5 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-quinto-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-quinto-900/10">
              <svg className="w-8 h-8 text-quinto-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-quinto-900 uppercase">Create Account</h1>
            <p className="text-xs font-bold text-quinto-400 uppercase tracking-[0.3em] mt-2">Join Quinto Store</p>
          </div>

          {apiError && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-600 text-[10px] font-black uppercase tracking-widest">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <InputGroup label="Full Name" name="name" placeholder="John Doe" formData={formData} handleChange={handleChange} errors={errors} />
              </div>
              <InputGroup label="Email" name="email" type="email" placeholder="john@quinto.com" formData={formData} handleChange={handleChange} errors={errors} />
              
              <div className="space-y-2">
                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-quinto-600">Cellphone</label>
                <div className="flex">
                  <select name="phonePrefix" value={formData.phonePrefix} onChange={handleChange} className="quinto-input !py-3 !px-3 !w-24 rounded-r-none bg-slate-50 border-r-0 text-quinto-900 font-bold">
                    {Object.entries(PHONE_RULES).map(([pref, rule]) => (
                      <option key={pref} value={pref}>{rule.flag} {pref}</option>
                    ))}
                  </select>
                  <input type="text" name="cellphone" value={formData.cellphone} onChange={handleChange} className="quinto-input rounded-l-none" placeholder={PHONE_RULES[formData.phonePrefix]?.placeholder} />
                </div>
                {errors.cellphone && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{errors.cellphone}</p>}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-quinto-900 mb-6 text-center">Shipping (Colombia Support)</h3>
              <div className="grid grid-cols-2 gap-6">
                <InputGroup label="Department" name="department" options={departments} formData={formData} handleChange={handleChange} errors={errors} />
                <InputGroup label="City" name="city" options={filteredCities} formData={formData} handleChange={handleChange} errors={errors} />
                <div className="col-span-2">
                  <InputGroup label="Address Details" name="addressDetails" placeholder="100 Street # 15 - 20" formData={formData} handleChange={handleChange} errors={errors} />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-6">
              <InputGroup label="Password" name="password" type="password" placeholder="••••••••" formData={formData} handleChange={handleChange} errors={errors} />
              <InputGroup label="Confirm" name="confirmPassword" type="password" placeholder="••••••••" formData={formData} handleChange={handleChange} errors={errors} />
            </div>

            <button type="submit" disabled={loading} className="w-full quinto-btn-primary py-4 shadow-xl shadow-quinto-900/10 mt-4">
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : 'REGISTER NOW'}
            </button>
          </form>

          <p className="mt-10 text-center text-xs text-quinto-400 font-bold uppercase tracking-widest">
            Already have an account? <Link to="/login" className="text-quinto-900 border-b-2 border-quinto-500 hover:text-quinto-500 transition-all ml-1">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;