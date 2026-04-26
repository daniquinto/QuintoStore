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

    const renderStars = (rate) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < Math.round(rate) ? 'text-yellow-400' : 'text-gray-300'}>
                ★
            </span>
        ));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <p className="text-xl text-gray-600">Producto no encontrado.</p>
                <button
                    onClick={() => navigate('/gallery')}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                    Volver a la galería
                </button>
            </div>
        );
    }

    const resolvedImage = imageMap[product.image] ?? product.image;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Back button */}
            <button
                onClick={() => navigate('/gallery')}
                className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-6 group"
            >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a la galería
            </button>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-1/2 relative">
                        <img
                            src={resolvedImage}
                            alt={product.title}
                            className="w-full h-80 md:h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            NUEVO
                        </div>
                    </div>

                    {/* Info */}
                    <div className="md:w-1/2 p-8 flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="text-xl">{renderStars(product.rate)}</div>
                                <span className="text-sm text-gray-500">({product.rate} / 5)</span>
                            </div>

                            {/* Price */}
                            <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
                                ${product.price}
                            </p>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed mb-8">
                                {product.description}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Quantity selector */}
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700">Cantidad:</span>
                                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-bold"
                                    >
                                        −
                                    </button>
                                    <span className="w-12 text-center font-semibold text-gray-900">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg font-bold"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to cart button */}
                            <button
                                onClick={handleAddToCart}
                                className={`w-full py-3 rounded-xl font-semibold text-white text-lg transition-all duration-300 ${
                                    added
                                        ? 'bg-green-500 scale-95'
                                        : 'bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 hover:opacity-90 hover:shadow-lg hover:shadow-purple-200 active:scale-95'
                                }`}
                            >
                                {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
