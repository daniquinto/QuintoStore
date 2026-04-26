import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { subscribeToAuthChanges } from '../../../firebase/auth';
import useProductStore from '../../../store/productStore';
import useCartStore from '../../../store/cartStore';
import useUserStore from '../../../store/userStore';

export default function Header() {
  const location = useLocation();
  const { user: loggedInUser, login, logout: clearUserStore } = useUserStore();
  const { searchTerm, setSearchTerm } = useProductStore();
  const totalItems = useCartStore(state => state.getTotalItems());
  const totalPrice = useCartStore(state => state.getTotalPrice());

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      if (currentUser) {
        login(currentUser);
      } else {
        clearUserStore();
      }
    });
    return () => unsubscribe();
  }, [login, clearUserStore]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full z-50">
      {/* Top Bar */}
      <div className="bg-mf-black text-white text-[13px] py-2.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p className="font-medium opacity-80">Free shipping, 30-day return or refund guarantee.</p>
          <div className="flex gap-6 uppercase tracking-wider font-bold">
            {loggedInUser ? (
              <span className="opacity-80">Welcome, {loggedInUser.displayName || loggedInUser.email.split('@')[0]}</span>
            ) : (
              <Link to="/login" className="hover:text-mf-red transition-colors">Sign In</Link>
            )}
            <Link to="#" className="hover:text-mf-red transition-colors">FAQs</Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="bg-white border-b border-gray-100 py-6 sticky top-0 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-1">
            <Link to="/" className="text-3xl font-black tracking-tighter text-mf-black uppercase">
              Male<span className="text-mf-red">Fashion</span>
            </Link>
          </div>

          {/* Nav Links */}
          <ul className="flex items-center gap-10">
            <li>
              <Link to="/" className={`nav-link ${isActive('/') ? 'text-mf-red' : 'text-mf-black'}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/gallery" className={`nav-link ${isActive('/gallery') ? 'text-mf-red' : 'text-mf-black'}`}>
                Shop
              </Link>
            </li>
            {loggedInUser && (
              <li>
                <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'text-mf-red' : 'text-mf-black'}`}>
                  Profile
                </Link>
              </li>
            )}
          </ul>

          {/* Icons */}
          <div className="flex-1 flex items-center justify-end gap-6">
            {/* Search */}
            <div className="relative hidden lg:block group">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-40 focus:w-64 bg-mf-gray border-none rounded-none py-1.5 px-4 text-xs transition-all duration-500 outline-none"
              />
              <svg className="w-4 h-4 absolute right-3 top-2 text-mf-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Cart */}
            <Link to="/cart" className="flex items-center gap-2 group">
              <div className="relative">
                <svg className="w-6 h-6 text-mf-black group-hover:text-mf-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-mf-black text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] uppercase font-bold text-mf-dark-gray leading-none">Your Cart</p>
                <p className="text-xs font-bold text-mf-black leading-tight">${totalPrice.toFixed(2)}</p>
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
