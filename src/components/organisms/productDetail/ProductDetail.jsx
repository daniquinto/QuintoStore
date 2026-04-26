import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProductStore from '../../../store/productStore';
import { imageMap } from '../../../assets/imageMap';
import useCartStore from '../../../store/cartStore';

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
    if (foundProduct) {
      setProduct(foundProduct);
    }
    setLoading(false);
  }, [id, products]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mf-black"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6">
        <p className="text-2xl font-bold uppercase tracking-widest text-mf-dark-gray">Product Not Found</p>
        <button onClick={() => navigate('/gallery')} className="btn-mf">Back to Shop</button>
      </div>
    );
  }

  const resolvedImage = imageMap[product.image] ?? product.image;
  const rating = product.rating?.rate || product.rate || 0;

  return (
    <div className="bg-white min-h-screen">
      {/* Header Info */}
      <div className="bg-mf-gray py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <span className="text-mf-black cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span className="text-mf-dark-gray">/</span>
            <span className="text-mf-black cursor-pointer" onClick={() => navigate('/gallery')}>Shop</span>
            <span className="text-mf-dark-gray">/</span>
            <span className="text-mf-dark-gray">Product Details</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="lg:flex gap-16">
          {/* Images Section */}
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <div className="bg-mf-gray aspect-[4/5] flex items-center justify-center p-12 overflow-hidden">
              <img
                src={resolvedImage}
                alt={product.title}
                className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Gallery Thumbnails (Visual placeholders) */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-mf-gray aspect-square cursor-pointer border-2 border-transparent hover:border-mf-black transition-all p-2">
                  <img src={resolvedImage} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:w-1/2 flex flex-col">
            <h1 className="text-3xl font-black text-mf-black uppercase tracking-tight mb-4">
              {product.title}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-mf-star fill-mf-star' : 'text-gray-200 fill-gray-200'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-mf-dark-gray border-l border-gray-200 pl-4">
                {product.rating?.count || 0} Reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8">
              <p className="text-4xl font-bold text-mf-black">${product.price}</p>
              <p className="text-xl text-mf-dark-gray line-through decoration-mf-red/50 decoration-2 font-bold">${(product.price * 1.2).toFixed(2)}</p>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-gray-500 mb-10 max-w-xl">
              {product.description}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-6 mb-10">
              <div className="flex items-center border-2 border-mf-gray h-12">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-full flex items-center justify-center font-bold hover:bg-mf-gray transition-colors"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-mf-black">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-full flex items-center justify-center font-bold hover:bg-mf-gray transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`h-12 px-12 text-sm font-bold uppercase tracking-widest transition-all ${
                  added 
                    ? 'bg-green-600 text-white' 
                    : 'bg-mf-black text-white hover:bg-mf-red'
                }`}
              >
                {added ? 'Added to Cart' : 'Add to Cart'}
              </button>
            </div>

            {/* Metadata */}
            <div className="space-y-3 pt-10 border-t border-gray-100">
              <p className="text-xs font-bold uppercase tracking-widest">
                <span className="text-mf-black">SKU:</span> <span className="text-mf-dark-gray">BE45V-{product.id}</span>
              </p>
              <p className="text-xs font-bold uppercase tracking-widest">
                <span className="text-mf-black">Category:</span> <span className="text-mf-dark-gray">{product.category}</span>
              </p>
              <p className="text-xs font-bold uppercase tracking-widest">
                <span className="text-mf-black">Tags:</span> <span className="text-mf-dark-gray">Fashion, Trends, {product.category}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
