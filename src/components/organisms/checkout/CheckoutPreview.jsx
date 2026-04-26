import React, { useState } from 'react';
import useCartStore from '../../../store/cartStore';
import useUserStore from '../../../store/userStore';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import app from '../../../firebase/firebase.config';

const CheckoutPreview = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (user) {
        const db = getFirestore(app);
        await addDoc(collection(db, "orders"), {
          userId: user.uid,
          customerName: user.name || user.displayName || 'Guest',
          items: items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
          })),
          total: getTotalPrice(),
          status: 'Confirmed',
          createdAt: new Date()
        });
      }
      
      setIsSuccess(true);
      clearCart();
      setTimeout(() => {
        navigate('/gallery');
      }, 3000);
    } catch (error) {
      console.error("Error saving order:", error);
      alert('Error processing purchase. Please check your Firestore rules.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8 animate-bounce">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-4xl font-black text-quinto-900 uppercase tracking-tighter mb-4">Purchase Successful!</h2>
        <p className="text-quinto-600 font-bold uppercase tracking-widest text-xs mb-8">Thank you for choosing Quinto Store. Your order is being prepared.</p>
        <div className="w-64 h-1 bg-quinto-100 rounded-full overflow-hidden">
          <div className="h-full bg-quinto-900 animate-[loading_3s_ease-in-out]"></div>
        </div>
        <p className="mt-4 text-[10px] text-quinto-400 font-bold uppercase tracking-widest">Redirecting to gallery...</p>
        
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes loading {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-quinto-50 rounded-full flex items-center justify-center mb-8 opacity-50">
          <svg className="w-8 h-8 text-quinto-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        </div>
        <h2 className="text-xl font-black text-quinto-900 uppercase tracking-widest mb-6">No items for checkout</h2>
        <button onClick={() => navigate('/gallery')} className="quinto-btn-primary">Back to Shop</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-quinto-50/50 py-20 border-b border-quinto-100">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-black text-quinto-900 uppercase tracking-tighter mb-4">Checkout</h1>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="text-quinto-600 cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span className="text-quinto-300">/</span>
            <span className="text-quinto-900">Checkout Preview</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="lg:flex gap-20">
          {/* Order Details */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-quinto-900 mb-10 pb-4 border-b border-quinto-100">
              Review Order & Delivery
            </h2>
            
            <div className="quinto-card p-10 mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-quinto-400">Customer</p>
                  <p className="text-quinto-900 font-bold text-lg leading-tight uppercase tracking-tight">{user?.name || user?.displayName || 'Guest User'}</p>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-quinto-400">Email Address</p>
                  <p className="text-quinto-900 font-bold text-lg leading-tight uppercase tracking-tight">{user?.email}</p>
                </div>
                <div className="md:col-span-2 space-y-3 pt-6 border-t border-quinto-50">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-quinto-400">Shipping Destination</p>
                  <p className="text-quinto-900 font-bold text-lg leading-tight uppercase tracking-tight">{user?.address || 'Colombia (Address details required)'}</p>
                </div>
              </div>
            </div>

            <div className="bg-quinto-950 p-10 rounded-[2rem] text-white">
              <div className="flex items-center gap-4 mb-6 text-quinto-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Payment Method</h3>
              </div>
              <p className="text-xs text-quinto-200 leading-relaxed font-medium opacity-70">
                Cash on delivery. Pay with cash upon delivery. 
                Our premium courier service will verify your identity before completing the hand-over.
              </p>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:w-1/3 mt-16 lg:mt-0">
            <div className="quinto-card p-10 sticky top-32">
              <h2 className="text-xl font-black uppercase tracking-tighter text-quinto-900 mb-8 border-b border-quinto-50 pb-6">Order Summary</h2>
              
              <div className="space-y-6 mb-10 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-black text-quinto-900 uppercase tracking-tight line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] font-bold text-quinto-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-black text-quinto-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-quinto-100 mb-10">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-quinto-400">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-quinto-400">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-black uppercase tracking-tighter text-quinto-900">Total</span>
                  <span className="text-3xl font-black text-quinto-500">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                disabled={loading}
                className="w-full quinto-btn-primary h-16 shadow-2xl shadow-quinto-900/10"
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPreview;
