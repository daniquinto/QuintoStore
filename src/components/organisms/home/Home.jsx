import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useProductStore from '../../../store/productStore';
import ProductCard from '../../molecules/ProductCard';

const Home = () => {
  const navigate = useNavigate();
  const { products, fetchProducts, setSelectedCategory } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get top 4 rated products as Best Sellers
  const bestSellers = [...products]
    .sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
    .slice(0, 4);

  const categories = [
    { name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=500&auto=format&fit=crop" },
    { name: "Jewelry", slug: "jewelry", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce33e?q=80&w=500&auto=format&fit=crop" },
    { name: "Men's Fashion", slug: "men's clothing", image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=500&auto=format&fit=crop" },
    { name: "Women's Fashion", slug: "women's clothing", image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=500&auto=format&fit=crop" },
  ];

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
    navigate('/gallery');
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-quinto-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-quinto-950 via-quinto-950/80 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="max-w-2xl">
            <span className="text-quinto-400 font-black uppercase tracking-[0.4em] mb-6 block">Limited Edition 2026</span>
            <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-8">
              UNCOMPROMISED <span className="text-quinto-500">QUALITY</span> FOR YOU.
            </h1>
            <p className="text-quinto-200 text-lg font-medium mb-10 max-w-lg leading-relaxed opacity-80">
              Quinto Store brings you a selection of premium essentials crafted with precision and designed for excellence.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/gallery" className="quinto-btn-primary group">
                Explore Collection
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Icons */}
      <section className="bg-quinto-900 py-12 border-y border-quinto-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { t: "Premium Quality", d: "Handpicked selection", i: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
            { t: "Fast Shipping", d: "Next day delivery", i: "M13 10V3L4 14h7v7l9-11h-7z" },
            { t: "Secure Payments", d: "100% encrypted", i: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
            { t: "Expert Support", d: "24/7 dedicated", i: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-quinto-500/10 flex items-center justify-center text-quinto-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.i} /></svg>
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest">{item.t}</h4>
                <p className="text-[10px] text-quinto-400 font-bold uppercase tracking-widest">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16">
          <h2 className="text-4xl font-black text-quinto-950 tracking-tighter uppercase">Browse Categories</h2>
          <p className="text-xs font-bold text-quinto-600 uppercase tracking-widest mt-2">Curated for your lifestyle</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              onClick={() => handleCategoryClick(cat.slug)}
              className={`group relative overflow-hidden rounded-[2rem] cursor-pointer ${i === 0 || i === 3 ? 'md:col-span-2' : ''} transition-all duration-700 hover:shadow-2xl hover:shadow-quinto-900/20`}
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-quinto-950 via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">{cat.name}</h3>
                <span className="inline-block bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest group-hover:bg-quinto-500 transition-colors">
                  Shop Now
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="bg-quinto-50/50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-black text-quinto-950 tracking-tighter uppercase">Best Sellers</h2>
              <p className="text-xs font-bold text-quinto-600 uppercase tracking-widest mt-2">The most loved pieces in our store</p>
            </div>
            <Link to="/gallery" onClick={() => setSelectedCategory('')} className="text-xs font-black uppercase tracking-[0.2em] text-quinto-900 border-b-2 border-quinto-500 hover:text-quinto-500 transition-all">
              View All Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer Minimalist */}
      <footer className="bg-quinto-950 py-20 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-quinto-800 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-quinto-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <h3 className="text-2xl font-black tracking-tighter uppercase">QUINTO STORE</h3>
            </div>
            <p className="text-quinto-400 text-sm font-medium leading-relaxed max-w-sm">
              Curating the world's finest essentials for those who don't settle for average. Welcome to the excellence club.
            </p>
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-quinto-500 mb-8">Menu</h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest opacity-60">
              <li><Link to="/" className="hover:text-quinto-500">Home</Link></li>
              <li><Link to="/gallery" onClick={() => setSelectedCategory('')} className="hover:text-quinto-500">Shop</Link></li>
              <li><Link to="/profile" className="hover:text-quinto-500">My Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-quinto-500 mb-8">Support</h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest opacity-60">
              <li><a href="#" className="hover:text-quinto-500">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-quinto-500">Returns</a></li>
              <li><a href="#" className="hover:text-quinto-500">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
           <span>© 2026 Quinto Store</span>
           <span>Made for Excellence</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
