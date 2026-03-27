/* eslint-disable @typescript-eslint/no-unused-vars */
import { config } from '@/config/env';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetails from './ProductDetails';

interface ProductPageProps {
    params: {
        slug: string;
    };
}

export const revalidate = 120;

// SSR Metadata without cache
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    try {
        const response = await fetch(`${config.BASE_URL}/api/v1/product/by-slug/${params.slug}`, {
            next: { revalidate: 120 },
        });
        if (!response.ok) {
            return {
                title: 'Product Not Found | ZysLet',
                description: 'The requested product could not be found.',
            };
        }

        const productData = await response.json();
        const product = productData?.data;

        if (!product) {
            return {
                title: 'Product Not Found | ZysLet',
                description: 'The requested product could not be found.',
            };
        }

        const description = product.meta_desc || product.desc || `${product.title} - Shop at ZysLet`;

        const keywords = Array.isArray(product.meta_keywords) ? product.meta_keywords.join(', ') : '';

        return {
            title: `${product.title} | ZysLet`,
            description,
            keywords,
            openGraph: {
                title: `${product.title} | ZysLet`,
                description,
                images: [
                    {
                        url: product.thumbnail || '',
                        width: 800,
                        height: 600,
                        alt: product.title,
                    },
                ],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${product.title} | ZysLet`,
                description,
                images: [product.thumbnail || ''],
            },
        };
    } catch (error: any) {
        return {
            title: 'Error | ZysLet',
            description: 'An unexpected error occurred while generating metadata.',
        };
    }
}

// Main SSR page — no cache
const ProductDetailsPage = async ({ params }: ProductPageProps) => {
    const response = await fetch(`${config.BASE_URL}/api/v1/product/by-slug/${params.slug}`, {
        next: { revalidate: 120 },
    });
    if (!response.ok) {
        notFound();
    }

    const product = await response.json();
    if (!product?.data) {
        notFound();
    }

    return <ProductDetails product={product.data} />;
};

export default ProductDetailsPage;
