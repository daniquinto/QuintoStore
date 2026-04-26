import { useState, useEffect } from "react";
import ProductCard from "../../molecules/ProductCard";
import { getProducts } from "../../../firebase/products";

/* REFERENCIA: lógica original con mockdata
import { mockProducts as MOCK_PRODUCTS } from "../../../mockdata/products";
export function GalleryMock() {
    return (
        <section className="p-6">
            <h2 className="text-2xl font-bold mb-6">Nuestros Productos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {MOCK_PRODUCTS.map((producto) => (
                    <ProductCard key={producto.id} product={producto} />
                ))}
            </div>
        </section>
    );
}
*/

export default function Gallery() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts().then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <section className="p-6">
            <h2 className="text-2xl font-bold mb-6">Nuestros Productos</h2>

            {/* Grid Layout Responsivo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {products.map((producto) => (
                    <ProductCard key={producto.id} product={producto} />
                ))}
            </div>
        </section>
    );
}