import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProductStore from '../../../store/productStore';
import { imageMap } from '../../../assets/imageMap';
import useCartStore from '../../../store/cartStore';

const formatCategory = (category) => {
  if (!category) return '';
  if (category === 'jewelery') return 'Jewelry';
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const products = useProductStore((state) => state.products);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const foundProduct = products.find(p => p.id.toString() === id);
    if (foundProduct) setProduct(foundProduct);
    setLoading(false);
  }, [id, products]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-quinto-800"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-quinto-50/30">
        <h2 className="text-2xl font-black text-quinto-900 uppercase tracking-widest mb-6">Piece Not Found</h2>
        <button onClick={() => navigate('/gallery')} className="quinto-btn-primary">Back to Shop</button>
      </div>
    );
  }

  const resolvedImage = imageMap[product.image] ?? product.image;
  const rating = product.rating?.rate || product.rate || 0;

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation Breadcrumb */}
      <div className="bg-quinto-50/50 py-8 border-b border-quinto-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="text-quinto-600 cursor-pointer hover:text-quinto-900" onClick={() => navigate('/')}>Home</span>
            <span className="text-quinto-300">/</span>
            <span className="text-quinto-600 cursor-pointer hover:text-quinto-900" onClick={() => navigate('/gallery')}>Collection</span>
            <span className="text-quinto-300">/</span>
            <span className="text-quinto-900">{formatCategory(product.category)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="lg:flex gap-20">
          {/* Gallery Showcase */}
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <div className="quinto-card bg-quinto-50/20 aspect-[4/5] flex items-center justify-center p-20 overflow-hidden relative">
               <div className="absolute top-10 right-10 flex flex-col gap-4 z-10">
                 <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:text-quinto-500 transition-colors">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                   </svg>
                 </button>
               </div>
              <img
                src={resolvedImage}
                alt={product.title}
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-1000 hover:scale-110"
              />
            </div>
          </div>

          {/* Product Intel */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="mb-8">
              <span className="text-quinto-500 text-xs font-black uppercase tracking-[0.3em] mb-4 block">Premium Piece</span>
              <h1 className="text-5xl font-black text-quinto-900 tracking-tighter uppercase leading-[0.95] mb-6">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-6 mb-10 pb-8 border-b border-quinto-50">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-quinto-500 fill-quinto-500' : 'text-quinto-100 fill-quinto-100'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs font-black text-quinto-900">{rating}</span>
                </div>
                <span className="w-1 h-1 bg-quinto-100 rounded-full"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-quinto-600">
                  {product.rating?.count || 0} reviews available
                </span>
              </div>

              <div className="flex items-baseline gap-4 mb-10">
                <span className="text-4xl font-black text-quinto-900">${product.price}</span>
                <span className="text-xl text-quinto-300 line-through decoration-quinto-500/40 font-medium">${(product.price * 1.3).toFixed(2)}</span>
              </div>

              <p className="text-sm leading-relaxed text-quinto-700 font-medium mb-12 max-w-lg">
                {product.description}
              </p>
            </div>

            {/* Shopping Logic */}
            <div className="flex flex-col gap-8 mb-12">
              <div className="flex items-center gap-10">
                <div className="flex items-center bg-quinto-50 rounded-2xl p-1 gap-1 border border-quinto-100">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center font-black hover:bg-white rounded-xl transition-all text-quinto-800">−</button>
                  <span className="w-10 text-center font-black text-quinto-900">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-12 flex items-center justify-center font-black hover:bg-white rounded-xl transition-all text-quinto-800">+</button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`flex-1 quinto-btn-primary h-14 ${added ? 'bg-green-600 hover:bg-green-700 border-none' : ''}`}
                >
                  {added ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3" /></svg>
                      Added to Cart
                    </span>
                  ) : 'Purchase Item'}
                </button>
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-y-4 pt-10 border-t border-quinto-50">
               <div className="flex flex-col">
                 <span className="text-[9px] font-black text-quinto-400 uppercase tracking-widest">Serial Number</span>
                 <span className="text-xs font-bold text-quinto-900 uppercase">QT-{product.id}-2026</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[9px] font-black text-quinto-400 uppercase tracking-widest">Collection</span>
                 <span className="text-xs font-bold text-quinto-900 uppercase">{formatCategory(product.category)}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
