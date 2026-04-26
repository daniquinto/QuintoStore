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
    <header className="w-full z-50 sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100">
      {/* Top Banner - Using Darker Color */}
      <div className="bg-quinto-950 text-quinto-200 text-[9px] py-2 text-center font-bold tracking-[0.3em] uppercase">
        Global Shipping Available • Quality Guaranteed • Quinto Premium
      </div>

      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex-1">
          <Link to="/" className="group flex items-center gap-3">
            <div className="w-11 h-11 bg-quinto-900 rounded-2xl flex items-center justify-center transition-all group-hover:bg-quinto-700 group-hover:rotate-6 shadow-lg shadow-quinto-900/10">
              <svg className="w-6 h-6 text-quinto-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black leading-none tracking-tighter text-quinto-950 uppercase">QUINTO</span>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-quinto-500">STORE</span>
            </div>
          </Link>
        </div>

        {/* Links */}
        <div className="hidden lg:flex flex-1 justify-center items-center gap-10">
          <Link to="/" className={`quinto-nav-link ${isActive('/') ? 'text-quinto-950 after:w-full' : ''}`}>Home</Link>
          <Link to="/gallery" className={`quinto-nav-link ${isActive('/gallery') ? 'text-quinto-950 after:w-full' : ''}`}>Shop</Link>
          {loggedInUser && (
            <Link to="/profile" className={`quinto-nav-link ${isActive('/profile') ? 'text-quinto-950 after:w-full' : ''}`}>Account</Link>
          )}
        </div>

        {/* Icons */}
        <div className="flex-1 flex items-center justify-end gap-6">
          {/* Search */}
          <div className="relative group hidden sm:block">
            <input
              type="text"
              placeholder="Search store..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-44 focus:w-64 bg-slate-100 border-none rounded-2xl py-2.5 px-10 text-xs transition-all duration-500 outline-none focus:ring-2 focus:ring-quinto-900/5"
            />
            <svg className="w-4 h-4 absolute left-4 top-3 text-quinto-800/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Cart Widget - Darker and more elegant */}
          <Link to="/cart" className="relative group flex items-center gap-4 bg-quinto-950 rounded-2xl py-2 pl-2 pr-5 text-white hover:bg-quinto-800 transition-all duration-300 shadow-xl shadow-quinto-950/10">
            <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-quinto-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-bold text-quinto-300 uppercase tracking-widest">{totalItems} items</span>
              <span className="text-xs font-black">${totalPrice.toFixed(2)}</span>
            </div>
          </Link>

          {!loggedInUser && (
            <Link to="/login" className="hidden sm:flex items-center justify-center w-11 h-11 bg-slate-50 border border-slate-100 rounded-2xl hover:border-quinto-900 transition-colors">
              <svg className="w-5 h-5 text-quinto-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
