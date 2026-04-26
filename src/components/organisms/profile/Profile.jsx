import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subscribeToAuthChanges, logoutUser } from '../../../firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import app from '../../../firebase/firebase.config';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    /* 
      // BACKUP: OLD LOCALSTORAGE METHOD
      // const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
      // setUser(loggedInUser);
      // setLoading(false);
    */

    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      if (currentUser) {
        const db = getFirestore(app);
        
        // Fetch user profile
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setUser(userDoc.exists() ? { ...currentUser, ...userDoc.data() } : currentUser);
        
        // Fetch order history
        const q = query(
          collection(db, "orders"), 
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
      /*
        // BACKUP: OLD LOCALSTORAGE METHOD
        // localStorage.removeItem('loggedInUser');
      */
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-xl text-gray-600">Please log in to view your profile</p>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Header/Cover background */}
        <div className="h-32 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"></div>
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start px-6 -mt-12 pb-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center text-3xl font-bold text-gray-500">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          
          {/* User Info */}
          <div className="mt-4 sm:mt-14 sm:ml-6 text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {user.displayName || 'Set your display name'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 sm:mt-14">
            <button
              onClick={handleLogout}
              className="px-6 py-2 border-2 border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Profile Details Sections */}
        <div className="border-t border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">User ID</dt>
              <dd className="mt-1 text-sm text-gray-900 break-all">{user.uid}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Account status</dt>
              <dd className="mt-1 text-sm text-green-600 font-medium">Active</dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Cellphone</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.cellphone || 'Not provided'}</dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.address || 'Not provided'}</dd>
            </div>
            {/* Add more info later if available connected logic */}
            <div className="sm:col-span-2">
               <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
               <dd className="mt-1 text-sm text-gray-900">{user.emailVerified ? 'Yes' : 'No'}</dd>
            </div>
          </dl>
        </div>

        {/* Order History Section */}
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order History</h3>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-brand-blue uppercase">Order #{order.id.slice(-6)}</span>
                    <span className="text-xs text-gray-400">{order.createdAt?.toDate().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </div>
                    <div className="text-lg font-black text-slate-800">${order.total?.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No orders found yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
