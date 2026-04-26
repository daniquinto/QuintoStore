import React, { useEffect, useState } from "react";
import ProductCard from "../../molecules/ProductCard";
import useProductStore from "../../../store/productStore";

const ITEMS_PER_PAGE = 8;

const ProductGallery = () => {
  const { filteredProducts, fetchProducts, loading, error } = useProductStore();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts.length]);

  if (loading && filteredProducts.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-quinto-800"></div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-quinto-600">Syncing Collection...</p>
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
      <section className="bg-quinto-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-quinto-400/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center sm:text-left">
          <span className="text-quinto-400 text-[11px] font-black uppercase tracking-[0.4em] mb-4 block">New Arrivals 2026</span>
          <h1 className="text-6xl font-black tracking-tighter mb-6 max-w-2xl leading-[0.9] mx-auto sm:mx-0">
            DISCOVER <span className="text-quinto-400">QUINTO</span> STORE SELECTION.
          </h1>
          <p className="text-quinto-200 max-w-md text-sm font-medium leading-relaxed mx-auto sm:mx-0">
            A premium curation of fashion, gadgets, and jewelry tailored for those who appreciate excellence and quality.
          </p>
        </div>
      </section>

      {/* Main Catalog */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-6">
          <div>
            <h2 className="text-2xl font-black text-quinto-900 tracking-tight">CURATED CATALOG</h2>
            <p className="text-xs font-bold text-quinto-600 uppercase tracking-widest mt-1">
              Explore {filteredProducts.length} premium pieces
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-quinto-100 text-xs font-bold uppercase tracking-widest hover:border-quinto-800 transition-all text-quinto-800">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Refine Search
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-24">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-12 h-12 flex items-center justify-center text-xs font-black transition-all rounded-xl ${
                  currentPage === page
                    ? 'bg-quinto-800 text-white shadow-xl shadow-quinto-800/20'
                    : 'bg-white text-quinto-800 border border-quinto-50 hover:bg-quinto-50'
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
