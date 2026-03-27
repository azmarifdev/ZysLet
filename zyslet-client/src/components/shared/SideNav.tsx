import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SideNavProps = {
    open: boolean;
    // eslint-disable-next-line no-unused-vars
    onOpenChange: (open: boolean) => void;
    navLinks: Array<{
        name: string;
        href: string;
        icon?: string;
    }>;
    categories: Array<{ id: string; title: string }>; // Update type to match API response format
};

export function SideNav({ open, onOpenChange, navLinks, categories }: SideNavProps) {
    const pathname = usePathname();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto">
                <SheetHeader className="pb-4 border-b border-gray-200 mb-6">
                    <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                {/* Main Navigation Links with Icons */}
                <div className="mb-8">
                    <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">Navigation</h3>
                    <nav className="flex flex-col space-y-1">
                        {navLinks.map((link) => (
                            <SheetClose asChild key={link.name}>
                                <Link
                                    href={link.href}
                                    className={`flex items-center px-3 py-3 rounded-md text-base ${
                                        pathname === link.href
                                            ? 'text-blue-600 font-medium bg-blue-50'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}>
                                    {link.icon && (
                                        <svg
                                            className="w-5 h-5 mr-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d={link.icon}
                                            />
                                        </svg>
                                    )}
                                    {link.name}
                                </Link>
                            </SheetClose>
                        ))}
                    </nav>
                </div>

                {/* Categories Section - Updated to use categories from API */}
                <div className="mb-8">
                    <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">Shop by Category</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {categories && categories.length > 0 ? (
                            categories.map((category) => (
                                <SheetClose asChild key={category.id}>
                                    <Link
                                        href={`/productPage?category=${encodeURIComponent(category.id)}`}
                                        className="bg-white hover:bg-blue-50 border border-gray-200 rounded-md p-2.5 text-center text-gray-700 font-medium text-sm transition-colors">
                                        {category.title}
                                    </Link>
                                </SheetClose>
                            ))
                        ) : (
                            <div className="col-span-2 text-center text-gray-500 py-2">Loading...</div>
                        )}
                    </div>
                </div>

                {/* Additional Links */}
                <div className="mb-8">
                    <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">More</h3>
                    <nav className="flex flex-col space-y-1">
                        <SheetClose asChild>
                            <Link
                                href="/contact"
                                className="flex items-center px-3 py-3 text-gray-700 rounded-md hover:bg-gray-100">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                Contact Us
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link
                                href="/faqs"
                                className="flex items-center px-3 py-3 text-gray-700 rounded-md hover:bg-gray-100">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                FAQs
                            </Link>
                        </SheetClose>
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
    );
}
