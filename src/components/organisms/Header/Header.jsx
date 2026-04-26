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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Close menu on location change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full z-[100] sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100">
      {/* Top Banner */}
      <div className="bg-quinto-950 text-quinto-200 text-[9px] py-2 text-center font-bold tracking-[0.3em] uppercase hidden sm:block">
        Global Shipping Available • Quality Guaranteed • Quinto Premium
      </div>

      <nav className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex-1 flex items-center gap-4">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-quinto-900"
          >
            {isMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
          
          <Link to="/" className="group flex items-center gap-3">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-quinto-900 rounded-xl md:rounded-2xl flex items-center justify-center transition-all group-hover:bg-quinto-700 group-hover:rotate-6 shadow-lg shadow-quinto-900/10">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-quinto-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black leading-none tracking-tighter text-quinto-950 uppercase">QUINTO</span>
              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-quinto-500">STORE</span>
            </div>
          </Link>
        </div>

        {/* Links (Desktop) */}
        <div className="hidden lg:flex flex-1 justify-center items-center gap-10">
          <Link to="/" className={`quinto-nav-link ${isActive('/') ? 'text-quinto-950 after:w-full' : ''}`}>Home</Link>
          <Link to="/gallery" className={`quinto-nav-link ${isActive('/gallery') ? 'text-quinto-950 after:w-full' : ''}`}>Shop</Link>
          {loggedInUser && (
            <Link to="/profile" className={`quinto-nav-link ${isActive('/profile') ? 'text-quinto-950 after:w-full' : ''}`}>Account</Link>
          )}
        </div>

        {/* Icons */}
        <div className="flex-1 flex items-center justify-end gap-3 md:gap-6">
          {/* Search (Desktop) */}
          <div className="relative group hidden lg:block">
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

          {/* Cart Widget */}
          <Link to="/cart" className="relative group flex items-center gap-2 md:gap-4 bg-quinto-950 rounded-xl md:rounded-2xl py-1.5 md:py-2 pl-2 pr-3 md:pr-5 text-white hover:bg-quinto-800 transition-all duration-300 shadow-xl shadow-quinto-950/10">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-white/10 rounded-lg md:rounded-xl flex items-center justify-center">
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-quinto-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[8px] md:text-[10px] font-bold text-quinto-300 uppercase tracking-widest">{totalItems}</span>
              <span className="hidden sm:inline text-xs font-black">${totalPrice.toFixed(2)}</span>
            </div>
          </Link>

          {!loggedInUser && (
            <Link to="/login" className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl hover:border-quinto-900 transition-colors">
              <svg className="w-5 h-5 text-quinto-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[73px] bg-white z-[90] animate-fade-in px-6 py-10 overflow-y-auto">
          <div className="flex flex-col gap-8">
            {/* Search (Mobile) */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-2xl py-4 px-12 text-sm outline-none"
              />
              <svg className="w-5 h-5 absolute left-4 top-3.5 text-quinto-800/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex flex-col gap-6 pt-4">
              <Link to="/" className="text-3xl font-black uppercase tracking-tighter text-quinto-900">Home</Link>
              <Link to="/gallery" className="text-3xl font-black uppercase tracking-tighter text-quinto-900">Gallery</Link>
              {loggedInUser ? (
                <Link to="/profile" className="text-3xl font-black uppercase tracking-tighter text-quinto-900 text-quinto-500">My Account</Link>
              ) : (
                <Link to="/login" className="text-3xl font-black uppercase tracking-tighter text-quinto-900 text-quinto-500">Sign In</Link>
              )}
            </div>

            <div className="mt-12 pt-12 border-t border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-quinto-400 mb-4">Customer Experience</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-quinto-900">24/7 Support</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <span className="text-[10px] font-black uppercase text-quinto-900">Global Ship</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
