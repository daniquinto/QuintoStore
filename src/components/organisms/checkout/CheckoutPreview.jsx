import React, { useState, useEffect } from 'react';
import useCartStore from '../../../store/cartStore';
import useUserStore from '../../../store/userStore';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import app from '../../../firebase/firebase.config';

const CheckoutPreview = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, login } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Address selection state
  const [selectedAddress, setSelectedAddress] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [fullUser, setFullUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        const db = getFirestore(app);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFullUser(data);
          if (data.addresses && data.addresses.length > 0) {
            setSelectedAddress(data.addresses[0]);
          }
        }
      }
    };
    fetchUser();
  }, [user]);

  const handleConfirm = async () => {
    const finalAddress = isAddingNew ? newAddress : selectedAddress;
    
    if (!finalAddress.trim()) {
      alert("Please provide a shipping address.");
      return;
    }

    setLoading(true);
    try {
      const db = getFirestore(app);
      
      // 1. If it's a new address, save it to the user profile too
      if (isAddingNew && user) {
        await updateDoc(doc(db, "users", user.uid), {
          addresses: arrayUnion(newAddress.trim())
        });
      }

      // 2. Register the order
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        customerName: user.name || user.displayName || 'Quinto Client',
        shippingAddress: finalAddress,
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
      setTimeout(() => {
        navigate('/gallery');
      }, 3000);
    } catch (error) {
      console.error("Error saving order:", error);
      alert('Error processing purchase. Verify your Firestore rules.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center font-ubuntu">
        <div className="w-24 h-24 bg-quinto-500 text-white rounded-full flex items-center justify-center mb-8 animate-pulse">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-4xl font-black text-quinto-900 uppercase tracking-tighter mb-4">Order Placed!</h2>
        <p className="text-quinto-600 font-bold uppercase tracking-widest text-xs mb-8">Payment method: Cash on Delivery. Ready for processing.</p>
        <div className="w-64 h-1 bg-quinto-100 rounded-full overflow-hidden">
          <div className="h-full bg-quinto-900 animate-[loading_3s_ease-in-out]"></div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes loading { from { width: 0%; } to { width: 100%; } }` }} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center font-ubuntu">
        <h2 className="text-xl font-black text-quinto-900 uppercase tracking-widest mb-6">No items in checkout</h2>
        <button onClick={() => navigate('/gallery')} className="quinto-btn-primary">Back to Shop</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-ubuntu pb-20">
      <div className="bg-quinto-50/50 py-20 border-b border-quinto-100">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-black text-quinto-900 uppercase tracking-tighter">Place Order</h1>
          <p className="text-xs font-bold text-quinto-500 uppercase tracking-widest mt-2">Cash on Delivery - Worldwide Premium Courier</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="lg:flex gap-20">
          <div className="lg:w-2/3">
            {/* Address Selection */}
            <section className="mb-16">
              <h2 className="text-xl font-black uppercase tracking-tighter text-quinto-900 mb-8 border-b border-quinto-50 pb-4">
                Select Shipping Address
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {fullUser?.addresses?.map((addr, i) => (
                  <div 
                    key={i} 
                    onClick={() => { setSelectedAddress(addr); setIsAddingNew(false); }}
                    className={`quinto-card p-6 cursor-pointer transition-all border-2 ${selectedAddress === addr && !isAddingNew ? 'border-quinto-600 bg-quinto-50/30' : 'border-transparent hover:bg-quinto-50/10'}`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-bold text-quinto-800 leading-relaxed">{addr}</p>
                      {selectedAddress === addr && !isAddingNew && (
                         <div className="w-5 h-5 bg-quinto-600 rounded-full flex items-center justify-center text-white shrink-0">
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                         </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <div 
                  onClick={() => setIsAddingNew(true)}
                  className={`quinto-card p-6 cursor-pointer transition-all border-2 border-dashed ${isAddingNew ? 'border-quinto-600 bg-quinto-50/30' : 'border-quinto-100 hover:border-quinto-400'}`}
                >
                  <p className="text-xs font-black uppercase tracking-widest text-quinto-400 text-center">
                    {isAddingNew ? 'New Address Form' : '+ Use New Address'}
                  </p>
                </div>
              </div>

              {isAddingNew && (
                <div className="animate-fade-in bg-quinto-50/50 p-8 rounded-[2rem]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-quinto-600 mb-4">Enter new address details</p>
                  <textarea 
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Full address, city, state and zip code..."
                    className="quinto-input !bg-white min-h-[120px] !text-sm mb-4"
                  />
                  <p className="text-[9px] text-quinto-400 font-bold uppercase tracking-widest italic">
                    * This address will be saved to your premium profile for future orders.
                  </p>
                </div>
              )}
            </section>

            {/* Order Preview List */}
            <section>
              <h2 className="text-xl font-black uppercase tracking-tighter text-quinto-900 mb-8 border-b border-quinto-50 pb-4">
                Items in Order
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-6 p-4 bg-quinto-50/30 rounded-2xl">
                    <div className="w-16 h-16 bg-white rounded-xl p-2 shrink-0">
                      <img src={item.product.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-black uppercase text-quinto-900 tracking-tight">{item.product.name}</h4>
                      <p className="text-[10px] font-bold text-quinto-500 uppercase tracking-widest">Quantity: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-black text-quinto-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:w-1/3">
            <div className="quinto-card p-10 bg-quinto-900 text-white sticky top-32">
              <h2 className="text-xl font-black uppercase tracking-widest mb-10 border-b border-white/10 pb-6">Checkout</h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest opacity-60">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest opacity-60">
                  <span>Method</span>
                  <span className="text-quinto-400">COD</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm font-black uppercase tracking-widest">Total to Pay</span>
                  <span className="text-3xl font-black text-quinto-400">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleConfirm}
                disabled={loading}
                className="w-full bg-white text-quinto-900 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-quinto-400 transition-all shadow-2xl shadow-black/20"
              >
                {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-quinto-900" /> : 'Confirm Purchase'}
              </button>
              
              <p className="mt-8 text-[9px] font-bold text-center text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                By confirming, you agree to pay the total amount upon delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPreview;
