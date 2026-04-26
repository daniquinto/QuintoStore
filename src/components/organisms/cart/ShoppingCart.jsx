import React from 'react';
import useCartStore from '../../../store/cartStore';
import useUserStore from '../../../store/userStore';
import { imageMap } from '../../../assets/imageMap';
import { Link, useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const { user } = useUserStore();

  const handleProceedToCheckout = () => {
    if (!user) {
      // Redirect to login but save the destination
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-quinto-50/50 py-20 border-b border-quinto-100">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-5xl font-black text-quinto-900 uppercase tracking-tighter">Your Bag</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-40">
          <div className="w-24 h-24 bg-quinto-50 rounded-full flex items-center justify-center mb-8">
            <svg className="w-10 h-10 text-quinto-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-quinto-900 uppercase tracking-widest mb-6">Your bag is empty</h2>
          <button onClick={() => navigate('/gallery')} className="quinto-btn-primary">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-quinto-50/50 py-20 border-b border-quinto-100">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-quinto-900 uppercase tracking-tighter">Your Bag</h1>
            <p className="text-xs font-bold text-quinto-500 uppercase tracking-widest mt-2">{items.length} items ready for checkout</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="text-quinto-600 cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span className="text-quinto-300">/</span>
            <span className="text-quinto-900">Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="lg:flex gap-20">
          {/* Items List */}
          <div className="lg:w-2/3">
            <div className="space-y-8">
              {items.map((item) => {
                const resolvedImage = imageMap[item.product.image] ?? item.product.image;
                return (
                  <div key={item.product.id} className="quinto-card p-6 flex items-center gap-8 relative group">
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="absolute top-4 right-4 w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    <div className="w-32 h-32 bg-quinto-50/30 rounded-2xl flex items-center justify-center p-4 overflow-hidden shrink-0">
                      <img src={resolvedImage} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>

                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-quinto-500 mb-1">{item.product.category}</p>
                      <h3 className="text-lg font-black text-quinto-900 uppercase tracking-tight leading-tight mb-2">{item.product.name}</h3>
                      <p className="text-sm font-black text-quinto-600">${item.product.price}</p>
                    </div>

                    <div className="flex flex-col items-end gap-4 shrink-0">
                      <div className="flex items-center bg-quinto-50 rounded-xl p-1 border border-quinto-100">
                        <button 
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="w-10 h-10 flex items-center justify-center font-black hover:bg-white rounded-lg transition-all"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-black text-quinto-900 text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center font-black hover:bg-white rounded-lg transition-all"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-lg font-black text-quinto-950">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12">
              <Link to="/gallery" className="text-xs font-black uppercase tracking-widest text-quinto-900 border-b-2 border-quinto-400 pb-1 hover:text-quinto-500 hover:border-quinto-500 transition-all">
                Add more items
              </Link>
            </div>
          </div>

          {/* Cart Totals */}
          <div className="lg:w-1/3 mt-16 lg:mt-0">
            <div className="quinto-card p-10 bg-quinto-900 text-white">
              <h2 className="text-xl font-black uppercase tracking-widest mb-10 border-b border-white/10 pb-6">Summary</h2>
              
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
                  <span className="text-3xl font-black text-quinto-400">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleProceedToCheckout}
                className="w-full bg-white text-quinto-900 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-quinto-400 transition-all shadow-2xl shadow-black/20"
              >
                Checkout Now
              </button>

              <div className="mt-8 flex items-center justify-center gap-4 opacity-30">
                <div className="w-8 h-8 rounded-lg bg-white/20"></div>
                <div className="w-8 h-8 rounded-lg bg-white/20"></div>
                <div className="w-8 h-8 rounded-lg bg-white/20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
