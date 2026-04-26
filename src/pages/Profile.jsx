import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToAuthChanges, logoutUser } from '../firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import app from '../firebase/firebase.config.js';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  const fetchUserData = async (currentUser) => {
    const db = getFirestore(app);
    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};
    setUser({ ...currentUser, ...userData });

    const q = query(collection(db, "orders"), where("userId", "==", currentUser.uid));
    const querySnapshot = await getDocs(q);
    const ordersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrders(ordersList.sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0)));
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      if (currentUser) {
        await fetchUserData(currentUser);
      } else {
        setUser(null);
        setOrders([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) navigate('/login');
  };

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;
    const db = getFirestore(app);
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      addresses: arrayUnion(newAddress.trim())
    });
    setNewAddress('');
    setShowAddressForm(false);
    await fetchUserData(user);
  };

  const handleRemoveAddress = async (addr) => {
    const db = getFirestore(app);
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      addresses: arrayRemove(addr)
    });
    await fetchUserData(user);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-quinto-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-quinto-50/30">
        <h2 className="text-2xl font-black text-quinto-900 uppercase mb-6 tracking-tighter">Access Denied</h2>
        <button onClick={() => navigate('/login')} className="quinto-btn-primary">Sign In</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-ubuntu pb-20">
      <div className="bg-quinto-950 text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-quinto-500/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-3xl bg-quinto-800 flex items-center justify-center border-4 border-white/10 shadow-2xl">
              <span className="text-4xl md:text-5xl font-black text-quinto-400 italic">
                {(user.name || user.email)?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="text-quinto-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Premium Client</span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none mb-4 break-words">
                {user.name || 'Quinto Client'}
              </h1>
              <p className="text-quinto-200 font-bold text-[10px] md:text-xs uppercase tracking-widest opacity-60">{user.email}</p>
            </div>
            <button onClick={handleLogout} className="w-full md:w-auto quinto-btn-outline !border-white/20 !text-white hover:!bg-white hover:!text-quinto-900 h-12 md:h-14">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          <div className="lg:col-span-1 space-y-12">
            {/* Contact Info */}
            <section>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-quinto-400 mb-8 border-b border-quinto-50 pb-4">Personal Info</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[9px] font-black text-quinto-300 uppercase tracking-widest mb-1">Mobile Contact</p>
                  <p className="text-sm font-bold text-quinto-900">{user.cellphone || 'N/A'}</p>
                </div>
              </div>
            </section>

            {/* Multiple Addresses Management */}
            <section>
              <div className="flex justify-between items-end mb-8 border-b border-quinto-50 pb-4">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-quinto-400">Shipping Addresses</h3>
                <button 
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-[10px] font-black uppercase text-quinto-600 hover:text-quinto-900 transition-colors"
                >
                  {showAddressForm ? 'Cancel' : '+ Add New'}
                </button>
              </div>

              {showAddressForm && (
                <div className="mb-8 space-y-4 animate-fade-in">
                  <textarea 
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Enter full address details..."
                    className="quinto-input !text-sm h-24"
                  />
                  <button onClick={handleAddAddress} className="w-full bg-quinto-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-quinto-800">
                    Save Address
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {(user.addresses || []).length > 0 ? (
                  user.addresses.map((addr, i) => (
                    <div key={i} className="group relative bg-quinto-50/50 rounded-2xl p-5 border border-transparent hover:border-quinto-200 transition-all">
                      <p className="text-xs font-bold text-quinto-800 leading-relaxed pr-8">{addr}</p>
                      <button 
                        onClick={() => handleRemoveAddress(addr)}
                        className="absolute top-4 right-4 text-quinto-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-quinto-300 font-bold uppercase tracking-widest text-center py-4">No addresses saved</p>
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-quinto-400 mb-8 border-b border-quinto-50 pb-4">Order History</h3>
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="quinto-card p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4">
                        <span className="bg-quinto-900 text-white text-[8px] md:text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                          QT-{order.id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-[9px] md:text-[10px] font-bold text-quinto-400 uppercase tracking-widest">
                          {order.createdAt?.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-[11px] md:text-xs font-bold text-quinto-600 uppercase tracking-tight">
                            {item.name} <span className="opacity-40">x{item.quantity}</span>
                          </p>
                        ))}
                      </div>
                      <p className="mt-4 text-[8px] md:text-[9px] font-black text-quinto-300 uppercase tracking-widest leading-relaxed">Shipped to: <span className="text-quinto-500">{order.shippingAddress || 'Default Address'}</span></p>
                    </div>
                    <div className="flex flex-row md:flex-col justify-between md:justify-end items-center md:items-end w-full md:w-auto gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-none border-quinto-50">
                      <p className="text-xl md:text-2xl font-black text-quinto-950">${order.total?.toFixed(2)}</p>
                      <span className="text-[8px] md:text-[9px] font-black text-green-600 uppercase tracking-[0.2em] bg-green-50 px-3 py-1 rounded-lg">Paid COD</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-quinto-50/20 rounded-[2rem] border-2 border-dashed border-quinto-100">
                <p className="text-xs font-black text-quinto-400 uppercase tracking-[0.3em]">History empty</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
