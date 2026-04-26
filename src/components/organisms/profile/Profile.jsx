import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToAuthChanges, logoutUser } from '../../../firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import app from '../../../firebase/firebase.config';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      if (currentUser) {
        const db = getFirestore(app);
        
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        setUser({ ...currentUser, ...userData });
        
        // Fetch order history (Simplified query to avoid mandatory indexing)
        const q = query(
          collection(db, "orders"), 
          where("userId", "==", currentUser.uid)
        );
        
        try {
          const querySnapshot = await getDocs(q);
          const ordersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Sort manually in JS to avoid "Query requires an index" error
          const sortedOrders = ordersList.sort((a, b) => {
            const dateA = a.createdAt?.toDate() || 0;
            const dateB = b.createdAt?.toDate() || 0;
            return dateB - dateA;
          });
          
          setOrders(sortedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
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
    if (result.success) {
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-quinto-900"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-quinto-600 font-ubuntu">Syncing Account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-quinto-50/30 font-ubuntu">
        <h2 className="text-2xl font-black text-quinto-900 uppercase tracking-tighter mb-6">Unauthorized</h2>
        <button onClick={() => navigate('/login')} className="quinto-btn-primary">Sign In to Access</button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-ubuntu">
      {/* Header Profile Section */}
      <div className="bg-quinto-950 text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-quinto-500/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-32 h-32 rounded-3xl bg-quinto-800 flex items-center justify-center border-4 border-white/10 shadow-2xl">
              <span className="text-5xl font-black text-quinto-400 italic">
                {(user.name || user.displayName || user.email)?.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <span className="text-quinto-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Premium Member</span>
              <h1 className="text-5xl font-black tracking-tighter uppercase leading-none mb-4">
                {user.name || user.displayName || 'Quinto Client'}
              </h1>
              <p className="text-quinto-200 font-bold text-xs uppercase tracking-widest opacity-60">ID: {user.uid.slice(0, 12)}...</p>
            </div>

            <div className="flex gap-4">
               <button onClick={handleLogout} className="quinto-btn-outline !border-white/20 !text-white hover:!bg-white hover:!text-quinto-900 h-14">
                 Sign Out
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Account Details */}
          <div className="lg:col-span-1 space-y-10">
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-quinto-400 mb-8 border-b border-quinto-50 pb-4">Personal Details</h3>
              <div className="space-y-8">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-quinto-300 mb-1">Email Registry</p>
                  <p className="text-sm font-bold text-quinto-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-quinto-300 mb-1">Mobile Contact</p>
                  <p className="text-sm font-bold text-quinto-900">{user.cellphone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-quinto-300 mb-1">Primary Address</p>
                  <p className="text-sm font-bold text-quinto-900 leading-relaxed">{user.address || 'Colombia (Default Region)'}</p>
                </div>
              </div>
            </div>

            <div className="quinto-card p-8 bg-quinto-50/50 border-none">
               <p className="text-xs font-bold text-quinto-700 leading-relaxed italic">
                 "Our client care team is available 24/7 to assist with your premium experience."
               </p>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-quinto-400 mb-8 border-b border-quinto-50 pb-4">Purchase History</h3>
            
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="quinto-card p-8 flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-quinto-400">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="bg-quinto-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                          QT-{order.id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-[10px] font-bold text-quinto-400 uppercase tracking-widest">
                          {order.createdAt?.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-xs font-bold text-quinto-600 uppercase tracking-tight">
                            {item.name} <span className="opacity-40">x{item.quantity}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="text-2xl font-black text-quinto-950">${order.total?.toFixed(2)}</p>
                      <span className="text-[9px] font-black text-green-600 uppercase tracking-[0.2em] bg-green-50 px-3 py-1 rounded-lg">
                        Delivered
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-quinto-50/20 rounded-[2rem] border-2 border-dashed border-quinto-100">
                <svg className="w-12 h-12 text-quinto-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                <p className="text-xs font-black text-quinto-400 uppercase tracking-[0.3em]">No orders yet in your history</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
