import ProductCarousel from '@/components/reusable/ProductCarousel';
import HeroSection from '@/components/pages-components/HeroSection';
import PromotionBanner from '@/components/pages-components/PromotionBanner';
import FeatureSection from '@/components/pages-components/FeatureSection';
import { config } from '@/config/env';

export const revalidate = 120;

async function fetchHomeData() {
    const [productsRes, bestSalesRes] = await Promise.all([
        fetch(`${config.BASE_URL}/api/v1/product/list?limit=20&page=1`, {
            next: { revalidate: 120 },
        }),
        fetch(`${config.BASE_URL}/api/v1/product/best-sales`, {
            next: { revalidate: 120 },
        }),
    ]);

    if (!productsRes.ok || !bestSalesRes.ok) {
        throw new Error('Failed to fetch homepage data');
    }

    const [productsJson, bestSalesJson] = await Promise.all([
        productsRes.json(),
        bestSalesRes.json(),
    ]);

    return {
        products: productsJson?.data || [],
        bestSales: bestSalesJson?.data || [],
    };
}

export default async function HomePage() {
    let products: any[] = [];
    let bestSales: any[] = [];
    let hasError = false;

    try {
        const data = await fetchHomeData();
        products = data.products;
        bestSales = data.bestSales;
    } catch (error) {
        hasError = true;
        console.error('Home page fetch error:', error);
    }

    return (
        <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6">
            <HeroSection />

            {hasError && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-md shadow-sm">
                    <p className="text-sm text-yellow-700">
                        কিছু data load হয়নি। পেজ refresh দিলে auto retry হবে।
                    </p>
                </div>
            )}

            <div className="space-y-2">
                {products.length > 0 && (
                    <ProductCarousel
                        products={products}
                        title="New Arrivals"
                        showSeeAllButton
                    />
                )}

                {bestSales.length > 0 && (
                    <ProductCarousel
                        products={bestSales}
                        title="Best Sales"
                        showSeeAllButton
                    />
                )}
            </div>

            <PromotionBanner />
            <FeatureSection />
        </div>
    );
}
