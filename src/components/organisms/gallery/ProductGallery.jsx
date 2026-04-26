import React, { useEffect, useState } from "react";
import ProductCard from "../../molecules/ProductCard";
import useProductStore from "../../../store/productStore";

const ITEMS_PER_PAGE = 8;

const ProductGallery = () => {
  const { 
    filteredProducts, 
    fetchProducts, 
    loading, 
    error, 
    selectedCategory, 
    setSelectedCategory,
    resetFilters 
  } = useProductStore();
  
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts.length, selectedCategory]);

  if (loading && filteredProducts.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-quinto-800"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-quinto-600">Syncing Collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-40">
        <p className="text-red-500 font-black uppercase tracking-widest">{error}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <section className="bg-quinto-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-quinto-400/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-quinto-400 text-[11px] font-black uppercase tracking-[0.4em] mb-4 block">Official Catalog</span>
          <h1 className="text-5xl font-black tracking-tighter leading-[0.9] uppercase">
            {selectedCategory ? `Browsing: ${selectedCategory}` : 'Full Collection'}
          </h1>
        </div>
      </section>

      {/* Main Catalog */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-quinto-900 tracking-tight uppercase">Products</h2>
            {selectedCategory && (
              <button 
                onClick={() => setSelectedCategory('')}
                className="bg-quinto-50 text-quinto-800 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 hover:bg-quinto-900 hover:text-white transition-all"
              >
                {selectedCategory}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-white border border-quinto-100 text-[10px] font-black uppercase tracking-widest hover:border-quinto-800 transition-all text-quinto-800"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-40">
            <h3 className="text-2xl font-black text-quinto-900 uppercase tracking-tighter mb-4">No pieces found</h3>
            <p className="text-quinto-600 text-sm font-bold uppercase tracking-widest mb-8">Try adjusting your filters or search term</p>
            <button onClick={resetFilters} className="quinto-btn-primary mx-auto">Reset Gallery</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-24">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-12 h-12 flex items-center justify-center text-xs font-black transition-all rounded-xl ${
                  currentPage === page
                    ? 'bg-quinto-900 text-white shadow-xl shadow-quinto-900/20'
                    : 'bg-white text-quinto-900 border border-quinto-50 hover:bg-quinto-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductGallery;
