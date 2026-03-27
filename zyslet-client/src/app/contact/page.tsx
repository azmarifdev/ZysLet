import { Suspense } from 'react';
import ContactPageComponent from '../../components/pages-components/ContactPageComponent';
import StaticPageClient from '@/components/client/StaticPageClient';

// Server component with proper Suspense boundary
export default function ContactPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <StaticPageClient>
                <ContactPageComponent />
            </StaticPageClient>
        </Suspense>
    );
}
