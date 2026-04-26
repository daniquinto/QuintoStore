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
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mf-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-mf-red font-bold uppercase tracking-widest">
        {error}
      </div>
    );
  }

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb Header */}
      <div className="bg-mf-gray py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-black text-mf-black uppercase tracking-tight mb-4">Shop</h1>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <span className="text-mf-black">Home</span>
            <span className="text-mf-dark-gray">/</span>
            <span className="text-mf-dark-gray">Shop</span>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-20">
        {/* Results Info & Sort */}
        <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
          <p className="text-sm font-bold uppercase tracking-widest text-mf-dark-gray">
            Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} results
          </p>
          <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest cursor-pointer hover:text-mf-red transition-colors">
            Sort by price: Low to High
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-20">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-12 h-12 flex items-center justify-center text-sm font-bold transition-all border-2 ${
                  currentPage === page
                    ? 'bg-mf-black border-mf-black text-white'
                    : 'bg-white border-transparent text-mf-black hover:border-mf-black'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-mf-gray">
            <p className="text-xl font-bold uppercase tracking-widest text-mf-dark-gray">No products found.</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 text-sm font-bold uppercase tracking-widest border-b-2 border-mf-black pb-1 hover:text-mf-red hover:border-mf-red transition-all"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductGallery;
