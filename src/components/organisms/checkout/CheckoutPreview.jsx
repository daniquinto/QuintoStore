import React from 'react';
import useCartStore from '../../../store/cartStore';
import useUserStore from '../../../store/userStore';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import app from '../../../firebase/firebase.config';

const CheckoutPreview = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useUserStore();

  const handleConfirm = async () => {
    try {
      if (user) {
        const db = getFirestore(app);
        await addDoc(collection(db, "orders"), {
          userId: user.uid,
          items: items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
          })),
          total: getTotalPrice(),
          createdAt: new Date()
        });
      }
      
      alert('Purchase confirmed! Thank you for choosing MaleFashion.');
      clearCart();
      navigate('/gallery');
    } catch (error) {
      console.error("Error saving order:", error);
      alert('Error processing purchase. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-mf-dark-gray mb-6">No items for checkout</h2>
        <button onClick={() => navigate('/gallery')} className="btn-mf">Back to Shop</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-mf-gray py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-black text-mf-black uppercase tracking-tight mb-4">Checkout</h1>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <span className="text-mf-black">Home</span>
            <span className="text-mf-dark-gray">/</span>
            <span className="text-mf-black">Shop</span>
            <span className="text-mf-dark-gray">/</span>
            <span className="text-mf-dark-gray">Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="lg:flex gap-16">
          {/* Billing Details */}
          <div className="lg:w-2/3">
            <h2 className="text-xl font-black uppercase tracking-widest text-mf-black mb-10 border-b-2 border-mf-gray pb-4">
              Billing Details
            </h2>
            
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-mf-dark-gray">Full Name</p>
                  <p className="text-mf-black font-bold border-b border-gray-100 pb-2">{user.name || user.displayName || 'Not provided'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-mf-dark-gray">Email Address</p>
                  <p className="text-mf-black font-bold border-b border-gray-100 pb-2">{user.email}</p>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-mf-dark-gray">Shipping Address</p>
                  <p className="text-mf-black font-bold border-b border-gray-100 pb-2">{user.address || 'Not provided'}</p>
                </div>
              </div>
            ) : (
              <div className="bg-mf-gray p-8 text-center">
                <p className="text-sm font-bold uppercase tracking-widest text-mf-dark-gray mb-4">You are checking out as guest</p>
                <button onClick={() => navigate('/login')} className="text-xs font-bold uppercase tracking-widest border-b-2 border-mf-black pb-1 hover:text-mf-red hover:border-mf-red transition-all">
                  Login for better experience
                </button>
              </div>
            )}

            <div className="mt-16 bg-mf-gray p-10">
              <h3 className="text-sm font-black uppercase tracking-widest text-mf-black mb-4">Payment Method</h3>
              <p className="text-xs text-mf-dark-gray leading-relaxed">
                Cash on delivery. Pay with cash upon delivery. 
                Other payment methods (Credit Card, PayPal) will be available soon.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 mt-16 lg:mt-0">
            <div className="bg-mf-black text-white p-10">
              <h2 className="text-lg font-black uppercase tracking-widest mb-8 border-b border-white/10 pb-6">Your Order</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-white/50 pb-2 border-b border-white/5">
                  <span>Product</span>
                  <span>Total</span>
                </div>
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-white/80 line-clamp-1 flex-1 pr-4">{item.product.name} x {item.quantity}</span>
                    <span className="text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10 mb-10">
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                  <span className="text-white/50">Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-black uppercase tracking-widest">
                  <span className="text-mf-red">Total</span>
                  <span className="text-mf-red">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                className="w-full bg-white text-mf-black hover:bg-mf-red hover:text-white py-4 text-xs font-black uppercase tracking-widest transition-all duration-300"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPreview;
