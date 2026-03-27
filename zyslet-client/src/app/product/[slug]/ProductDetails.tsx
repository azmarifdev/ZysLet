import Link from "next/link";
import {FC} from "react";

import {Product} from "../types";
import ProductView from "@/components/pages-components/ProductView";
import ProductDescription from "@/components/pages-components/ProductDescription";
import ProductCarousel from "@/components/reusable/ProductCarousel";


interface ProductDetailsProps {
    product: Product;
}

const ProductDetails: FC<ProductDetailsProps> = ({product}) => {
    return (
        <main>
            {/* Breadcrumb navigation */}
            <div className="bg-gray-50 py-3 mb-4 md:mb-8 border-b border-gray-100">
                <div className="container mx-auto px-0 max-w-7xl">
                    <nav className="flex text-sm">
                        <Link
                            href="/"
                            className="text-gray-500 hover:text-blue-600 transition-colors">
                            Home
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <Link
                            href="/productPage"
                            className="text-gray-500 hover:text-blue-600 transition-colors">
                            Products
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="text-gray-900 font-medium truncate">
                            {product?.title || "Loading..."}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Product Details Section */}
            <div className="container mx-auto px-0 max-w-7xl">
                <ProductView product={product} />

                {/* Product Description - lazy loaded */}
                <ProductDescription product={product} />
            </div>

            {/* Related Products - lazy loaded and only shown when data is available */}
            {product?.relatedProducts?.length > 0 && (
                <div className="bg-gray-50 py-10 border-t border-gray-100 mt-8">
                    <div className="container mx-auto px-0 max-w-7xl">
                        <ProductCarousel
                            products={product?.relatedProducts}
                            title="You May Also Like"
                        />
                    </div>
                </div>
            )}
        </main>
    );
};

export default ProductDetails;
