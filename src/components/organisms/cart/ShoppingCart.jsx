import React from 'react';
import useCartStore from '../../../store/cartStore';
import { imageMap } from '../../../assets/imageMap';
import { Link, useNavigate } from 'react-router-dom';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-mf-gray py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-black text-mf-black uppercase tracking-tight mb-4">Shopping Cart</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-40">
          <svg className="w-20 h-20 text-mf-dark-gray mb-6 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-2xl font-bold text-mf-black uppercase tracking-widest mb-4">Your cart is empty</h2>
          <button onClick={() => navigate('/gallery')} className="btn-mf">Shop Now</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-mf-gray py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-black text-mf-black uppercase tracking-tight mb-4">Shopping Cart</h1>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <span className="text-mf-black">Home</span>
            <span className="text-mf-dark-gray">/</span>
            <span className="text-mf-black">Shop</span>
            <span className="text-mf-dark-gray">/</span>
            <span className="text-mf-dark-gray">Shopping Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="lg:flex gap-16">
          {/* Items List */}
          <div className="lg:w-2/3">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 uppercase tracking-widest text-sm font-bold text-mf-black">
                  <th className="pb-6">Product</th>
                  <th className="pb-6">Quantity</th>
                  <th className="pb-6">Total</th>
                  <th className="pb-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => {
                  const resolvedImage = imageMap[item.product.image] ?? item.product.image;
                  return (
                    <tr key={item.product.id} className="group">
                      <td className="py-10">
                        <div className="flex items-center gap-6">
                          <div className="w-24 h-24 bg-mf-gray p-4 flex items-center justify-center overflow-hidden">
                            <img src={resolvedImage} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                          </div>
                          <div>
                            <h3 className="font-bold text-mf-black uppercase tracking-tight">{item.product.name}</h3>
                            <p className="text-mf-red font-black mt-1">${item.product.price}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-10">
                        <div className="flex items-center border border-mf-gray w-fit">
                          <button 
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center font-bold hover:bg-mf-gray"
                          >
                            −
                          </button>
                          <span className="w-10 text-center font-bold text-mf-black">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center font-bold hover:bg-mf-gray"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-10 font-bold text-mf-black text-lg">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-10 text-right">
                        <button 
                          onClick={() => removeItem(item.product.id)}
                          className="w-10 h-10 flex items-center justify-center rounded-full text-mf-dark-gray hover:bg-mf-gray hover:text-mf-black transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex justify-between mt-12 pt-12 border-t border-gray-100">
              <Link to="/gallery" className="text-xs font-bold uppercase tracking-widest border-b-2 border-mf-black pb-1 hover:text-mf-red hover:border-mf-red transition-all">
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Totals */}
          <div className="lg:w-1/3 mt-16 lg:mt-0">
            <div className="bg-mf-gray p-10">
              <h2 className="text-lg font-black uppercase tracking-widest text-mf-black mb-8 border-b border-white pb-6">Cart Total</h2>
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-mf-black">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-mf-red">
                  <span>Total</span>
                  <span className="text-xl">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full btn-mf py-4 text-center"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
