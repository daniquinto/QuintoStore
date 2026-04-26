import { imageMap } from "../../assets/imageMap";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const resolvedImage = imageMap[product.image] ?? product.image;
  const rating = product.rating?.rate || product.rate || 0;

  return (
    <div className="group w-full max-w-[280px]">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-mf-gray aspect-[3/4] flex items-center justify-center p-8">
        {/* Badge */}
        <span className="absolute top-5 left-5 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-mf-black z-10">
          New
        </span>
        
        {/* Image */}
        <img 
          src={resolvedImage} 
          alt={product.title} 
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
        />

        {/* Quick View Overlay (Visual only) */}
        <div className="absolute inset-0 bg-mf-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      <div className="mt-6 space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-mf-dark-gray">
          {product.category}
        </p>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-sm font-bold text-mf-black hover:text-mf-red transition-colors line-clamp-1">
            {product.title}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-mf-star fill-mf-star' : 'text-gray-200 fill-gray-200'}`} 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <p className="text-lg font-bold text-mf-black">${product.price}</p>
          <p className="text-sm text-mf-dark-gray line-through decoration-mf-red/50">${(product.price * 1.2).toFixed(2)}</p>
        </div>

        {/* Description Snippet */}
        <p className="text-xs text-mf-dark-gray line-clamp-2 leading-relaxed pt-1">
          {product.description}
        </p>
      </div>
    </div>
  );
}

export default ProductCard;