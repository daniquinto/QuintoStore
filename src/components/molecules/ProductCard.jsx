import { imageMap } from "../../assets/imageMap";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const resolvedImage = imageMap[product.image] ?? product.image;
  const rating = product.rating?.rate || product.rate || 0;

  return (
    <div className="quinto-card group flex flex-col h-full overflow-hidden">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-quinto-50/50 aspect-square flex items-center justify-center p-10">
        {/* Sale Badge */}
        {product.price < 50 && (
          <span className="absolute top-4 left-4 bg-quinto-500 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest z-10 rounded-full">
            Sale
          </span>
        )}
        
        {/* Image */}
        <img 
          src={resolvedImage} 
          alt={product.title} 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
        />

        {/* Floating Quick Add */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
           <button className="w-full bg-quinto-900/90 backdrop-blur-sm text-white py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg">
             View Details
           </button>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-quinto-600">
            {product.category}
          </p>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3 text-quinto-500 fill-quinto-500" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[10px] font-black text-quinto-900">{rating}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-sm font-bold text-quinto-900 hover:text-quinto-600 transition-colors line-clamp-2 leading-relaxed h-10">
            {product.title}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-quinto-50">
          <p className="text-lg font-black text-quinto-900">${product.price}</p>
          <button className="w-8 h-8 rounded-full bg-quinto-50 flex items-center justify-center hover:bg-quinto-800 hover:text-white transition-all text-quinto-800">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;