import React from 'react';
import useCartStore from '../../../store/cartStore';
import useUserStore from '../../../store/userStore';
import Button from '../../atoms/Button';
import { useNavigate } from 'react-router-dom';

const CheckoutPreview = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useUserStore();

  const handleConfirm = () => {
    alert('¡Compra confirmada! Gracias por elegir MyStore.');
    clearCart();
    navigate('/gallery');
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">No hay productos para el checkout</h2>
        <Button onClick={() => navigate('/gallery')}>Volver a la tienda</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-10">Resumen de tu Pedido</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Productos</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <span className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold text-slate-600">
                      {item.quantity}
                    </span>
                    <span className="text-slate-700 font-medium">{item.product.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Información de envío */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Datos de Envío</h2>
            {user ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Nombre</p>
                  <p className="font-bold text-slate-700">{user.name}</p>
                </div>
                <div>
                  <p className="text-slate-400">Email</p>
                  <p className="font-bold text-slate-700">{user.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400">Dirección</p>
                  <p className="font-bold text-slate-700">{user.address}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 italic">No has iniciado sesión. Los datos se solicitarán al pagar.</p>
            )}
          </div>
        </div>
        
        {/* Total y Acción */}
        <div className="md:col-span-1">
          <div className="bg-brand-blue p-8 rounded-3xl shadow-xl shadow-brand-blue/20 text-white sticky top-24">
            <h2 className="text-xl font-bold mb-6">Total a Pagar</h2>
            <div className="flex justify-between items-end mb-8">
              <span className="text-white/70">Subtotal + Envío</span>
              <span className="text-4xl font-black">${getTotalPrice().toFixed(2)}</span>
            </div>
            
            <Button 
              onClick={handleConfirm}
              className="w-full bg-white !text-brand-blue hover:bg-gray-100 py-4 text-lg font-bold shadow-none"
            >
              Confirmar Compra
            </Button>
            
            <p className="text-center text-xs text-white/50 mt-6">
              Al confirmar, aceptas nuestros términos y condiciones de servicio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPreview;
