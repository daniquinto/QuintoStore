import React, { useState, useEffect } from 'react';
import useCartStore from '../store/cartStore';
import useUserStore from '../store/userStore';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import app from '../firebase/firebase.config.js';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [fullUser, setFullUser] = useState(null);

  // New Address Structure
  const [newAddrData, setNewAddrData] = useState({
    department: '',
    city: '',
    details: ''
  });
  const [departments, setDepartments] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  const fetchUserData = async () => {
    if (user) {
      const db = getFirestore(app);
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setFullUser(data);
        if (data.addresses && data.addresses.length > 0 && !selectedAddress) {
          setSelectedAddress(data.addresses[0]);
        }
      }
    }
  };

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
        console.error("API Colombia Error:", err);
      }
    };
    fetchData();
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (newAddrData.department) {
      const deptId = departments.find(d => d.name === newAddrData.department)?.id;
      if (deptId) {
        setFilteredCities(allCities.filter(c => c.departmentId === deptId).sort((a, b) => a.name.localeCompare(b.name)));
      }
    }
  }, [newAddrData.department, departments, allCities]);

  const handleSaveNewAddress = async () => {
    if (!newAddrData.department || !newAddrData.city || !newAddrData.details) {
      alert("Please complete all address fields.");
      return;
    }

    setSaveLoading(true);
    try {
      const finalAddress = `${newAddrData.details}, ${newAddrData.city}, ${newAddrData.department}, Colombia`;
      const db = getFirestore(app);
      
      await updateDoc(doc(db, "users", user.uid), {
        addresses: arrayUnion(finalAddress)
      });

      await fetchUserData();
      setSelectedAddress(finalAddress);
      setIsAddingNew(false);
      setNewAddrData({ department: '', city: '', details: '' });
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Error saving address to profile.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedAddress) {
      alert("Please select a shipping address.");
      return;
    }

    setLoading(true);
    try {
      const db = getFirestore(app);
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        customerName: user.name || user.displayName || 'Quinto Client',
        shippingAddress: selectedAddress,
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        total: getTotalPrice(),
        paymentMethod: 'Cash on Delivery',
        status: 'Confirmed',
        createdAt: new Date()
      });
      
      setIsSuccess(true);
      clearCart();
      setTimeout(() => navigate('/gallery'), 3000);
    } catch (error) {
      console.error("Purchase Error:", error);
      alert('Error processing purchase.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center font-ubuntu">
        <div className="w-24 h-24 bg-quinto-500 text-white rounded-full flex items-center justify-center mb-8">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-4xl font-black text-quinto-900 uppercase tracking-tighter mb-4">Order Placed!</h2>
        <p className="text-quinto-600 font-bold uppercase tracking-widest text-xs mb-8">Method: Cash on Delivery. Redirecting...</p>
        <div className="w-64 h-1 bg-quinto-100 rounded-full overflow-hidden">
          <div className="h-full bg-quinto-900 animate-[loading_3s_ease-in-out]"></div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes loading { from { width: 0%; } to { width: 100%; } }` }} />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-ubuntu pb-20">
      <div className="bg-quinto-50/50 py-20 border-b border-quinto-100">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-black text-quinto-900 uppercase tracking-tighter">Shipping Info</h1>
          <p className="text-xs font-bold text-quinto-500 uppercase tracking-widest mt-2">Cash on Delivery Worldwide Delivery</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="lg:flex gap-20">
          <div className="lg:w-2/3">
            <h2 className="text-xl font-black uppercase tracking-tighter text-quinto-900 mb-10 pb-4 border-b border-quinto-100">
              Delivery Address
            </h2>
            
            <div className="space-y-10">
              <div className="space-y-4">
                <label className="block text-[11px] font-black uppercase tracking-[0.3em] text-quinto-400">
                  Select Registered Address
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <select 
                      disabled={isAddingNew}
                      value={selectedAddress}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      className={`quinto-input appearance-none pr-12 ${isAddingNew ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                    >
                      {fullUser?.addresses?.map((addr, i) => (
                        <option key={i} value={addr}>{addr}</option>
                      ))}
                      {!fullUser?.addresses?.length && <option value="">No addresses registered</option>}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-quinto-300">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setIsAddingNew(!isAddingNew)}
                    className={`px-8 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isAddingNew ? 'bg-red-50 text-red-500 border-2 border-red-100' : 'bg-quinto-50 text-quinto-900 hover:bg-quinto-100'}`}
                  >
                    {isAddingNew ? 'Cancel' : '+ Add New'}
                  </button>
                </div>
              </div>

              {isAddingNew && (
                <div className="animate-fade-in bg-quinto-50/50 p-10 rounded-[2.5rem] border-2 border-quinto-100 border-dashed space-y-8">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-quinto-900 mb-2">New Shipping Detail</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-quinto-400">Department</label>
                      <select 
                        value={newAddrData.department}
                        onChange={(e) => setNewAddrData({...newAddrData, department: e.target.value, city: ''})}
                        className="quinto-input !bg-white !text-sm"
                      >
                        <option value="">Select State</option>
                        {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-quinto-400">City</label>
                      <select 
                        disabled={!newAddrData.department}
                        value={newAddrData.city}
                        onChange={(e) => setNewAddrData({...newAddrData, city: e.target.value})}
                        className="quinto-input !bg-white !text-sm"
                      >
                        <option value="">Select City</option>
                        {filteredCities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-quinto-400">Street Address & Details</label>
                      <input 
                        type="text"
                        value={newAddrData.details}
                        onChange={(e) => setNewAddrData({...newAddrData, details: e.target.value})}
                        placeholder="123 Street # 45 - 67, Apt 101"
                        className="quinto-input !bg-white !text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-quinto-100">
                    <div className="flex items-center gap-3 text-quinto-400">
                      <div className="w-5 h-5 rounded-full bg-quinto-500/10 flex items-center justify-center text-quinto-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <p className="text-[9px] font-bold uppercase tracking-widest">Saves to your profile</p>
                    </div>
                    <button 
                      onClick={handleSaveNewAddress}
                      disabled={saveLoading}
                      className="w-full sm:w-auto px-10 h-14 bg-quinto-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-quinto-800 shadow-xl shadow-quinto-900/20"
                    >
                      {saveLoading ? 'Saving...' : 'Save & Use Address'}
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-10 border-t border-quinto-50">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-quinto-400 mb-8">Summary Bag</h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-6 p-4 rounded-2xl">
                      <div className="w-16 h-16 bg-quinto-50 rounded-xl p-2 shrink-0">
                        <img src={item.product.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-black uppercase text-quinto-900 tracking-tight">{item.product.name}</h4>
                        <p className="text-[10px] font-bold text-quinto-500 uppercase tracking-widest">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-black text-quinto-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="quinto-card p-10 bg-quinto-900 text-white sticky top-32">
              <h2 className="text-xl font-black uppercase tracking-widest mb-10 border-b border-white/10 pb-6">Final Order</h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest opacity-60">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest opacity-60">
                  <span>Method</span>
                  <span className="text-quinto-400">Cash on Delivery</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm font-black uppercase tracking-widest">Total</span>
                  <span className="text-3xl font-black text-quinto-400">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                disabled={loading || isAddingNew}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl ${isAddingNew ? 'bg-white/20 text-white/40 cursor-not-allowed' : 'bg-white text-quinto-900 hover:bg-quinto-400 shadow-black/20'}`}
              >
                {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-quinto-900" /> : 'Place Order'}
              </button>
              {isAddingNew && <p className="mt-4 text-[9px] text-center text-quinto-400 font-bold uppercase tracking-widest">Save the new address to continue</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
