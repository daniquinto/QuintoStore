import React from 'react';
import useCartStore from '../store/cartStore';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const { user } = useUserStore();

  const handleCheckout = () => {
    if (!user) {
      // Redirect to login with a message or just redirect
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center font-ubuntu">
        <div className="w-24 h-24 bg-quinto-50 rounded-full flex items-center justify-center mb-10">
          <svg className="w-10 h-10 text-quinto-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        </div>
        <h2 className="text-3xl font-black text-quinto-900 uppercase tracking-tighter mb-4">Your bag is empty</h2>
        <p className="text-quinto-500 font-bold uppercase tracking-widest text-xs mb-10">Discover our premium selection</p>
        <Link to="/gallery" className="quinto-btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-ubuntu pb-20">
      {/* Header Section */}
      <div className="bg-quinto-50/50 py-20 border-b border-quinto-100">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-quinto-900 uppercase tracking-tighter">Your Bag</h1>
            <p className="text-xs font-bold text-quinto-500 uppercase tracking-widest mt-2">Ready for worldwide shipping</p>
          </div>
          <span className="text-[10px] font-black text-quinto-400 uppercase tracking-[0.3em]">{items.length} Unique Pieces</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="lg:flex gap-20">
          {/* Items List */}
          <div className="lg:w-2/3 space-y-8">
            {items.map((item) => (
              <div key={item.product.id} className="quinto-card p-8 flex flex-col sm:flex-row items-center gap-10 group relative">
                <button 
                  onClick={() => removeItem(item.product.id)}
                  className="absolute top-4 right-4 text-quinto-200 hover:text-red-500 transition-colors sm:opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="w-32 h-32 bg-quinto-50 rounded-2xl p-4 shrink-0 flex items-center justify-center">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[10px] font-black text-quinto-400 uppercase tracking-widest block mb-2">{item.product.category}</span>
                  <h3 className="text-lg font-black text-quinto-900 uppercase tracking-tight mb-4">{item.product.name}</h3>
                  <p className="text-xl font-black text-quinto-900">${item.product.price}</p>
                </div>

                <div className="flex items-center bg-quinto-50 rounded-xl p-1 gap-1 border border-quinto-100">
                  <button 
                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center font-black hover:bg-white rounded-lg transition-all text-quinto-800"
                  >−</button>
                  <span className="w-8 text-center font-black text-quinto-900 text-xs">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center font-black hover:bg-white rounded-lg transition-all text-quinto-800"
                  >+</button>
                </div>

                <div className="text-right hidden sm:block min-w-[100px]">
                  <p className="text-[10px] font-black text-quinto-300 uppercase tracking-widest mb-1">Subtotal</p>
                  <p className="text-xl font-black text-quinto-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 mt-12 lg:mt-0">
            <div className="quinto-card p-10 bg-quinto-900 text-white sticky top-32">
              <h2 className="text-2xl font-black uppercase tracking-widest mb-12 border-b border-white/10 pb-6">Summary</h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest opacity-60">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest opacity-60">
                  <span>Delivery</span>
                  <span className="text-quinto-400">Free</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm font-black uppercase tracking-widest">Total Price</span>
                  <span className="text-4xl font-black text-quinto-400">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-white text-quinto-900 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-quinto-400 transition-all shadow-2xl shadow-black/20"
              >
                Checkout Now
              </button>
              
              {!user && (
                <p className="mt-6 text-[9px] text-center text-quinto-400 font-bold uppercase tracking-widest leading-relaxed">
                  * Authentication required for secure checkout
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
