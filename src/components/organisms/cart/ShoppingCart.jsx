import React from 'react';
import useCartStore from '../../../store/cartStore';
import Button from '../../atoms/Button';
import { imageMap } from '../../../assets/imageMap';

const ShoppingCart = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Tu carrito está vacío</h2>
        <p className="text-slate-400 mb-8">¡Explora nuestra tienda y encuentra algo increíble!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">Carrito de Compras</h2>
        
        <div className="space-y-6">
          {items.map((item) => {
            const resolvedImage = imageMap[item.product.image] ?? item.product.image;
            return (
              <div key={item.product.id} className="flex items-center gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                <img 
                  src={resolvedImage} 
                  alt={item.product.name} 
                  className="w-24 h-24 object-cover rounded-2xl shadow-sm"
                />
                
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg">{item.product.name}</h3>
                  <p className="text-brand-blue font-bold text-xl">${item.product.price}</p>
                </div>
                
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl">
                  <button 
                    onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center font-bold hover:text-brand-blue"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-slate-700">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center font-bold hover:text-brand-blue"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={() => removeItem(item.product.id)}
                  className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-gray-50 p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-slate-400 font-medium">Total estimado</p>
          <p className="text-4xl font-black text-slate-800">${getTotalPrice().toFixed(2)}</p>
        </div>
        
        <div className="flex gap-4 w-full sm:w-auto">
          <Button 
            onClick={clearCart} 
            className="flex-1 sm:flex-none bg-white border border-gray-200 !text-slate-600 hover:!bg-gray-100 shadow-none"
          >
            Vaciar
          </Button>
          <Button className="flex-1 sm:flex-none px-12">
            Pagar ahora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
