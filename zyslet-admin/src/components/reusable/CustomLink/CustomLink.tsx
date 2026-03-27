import React, { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';

const style = {
    link: 'w-full inline-flex items-center py-3 mb-2 text-base px-4 hover:bg-slate-700/50 rounded-lg text-slate-200 capitalize transition-all duration-200 sidebar-item-hover',
};

type NavLinkProps = {
    href: string;
    icon: IconType;
    label: string;
    isCollapsed?: boolean;
};

const CustomLink: FC<NavLinkProps> = ({ href, icon: Icon, label, isCollapsed = false }) => {
    const pathname = usePathname();

    if (isCollapsed) {
        return (
            <div className="group relative">
                <Link href={href} passHref>
                    <div
                        className={`w-full flex items-center justify-center py-3 mb-2 text-base px-4 hover:bg-slate-700/50 rounded-lg transition-all duration-200 cursor-pointer ${
                            pathname === href ? 'bg-slate-700/50 text-blue-400' : 'text-slate-200'
                        }`}>
                        <Icon size={20} className={pathname === href ? 'text-blue-400' : 'text-slate-300'} />
                    </div>
                </Link>

                {/* Tooltip */}
                <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 border border-slate-600">
                    {label}
                    <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 border-l border-b border-slate-600 rotate-45"></div>
                </div>
            </div>
        );
    }

    return (
        <Link href={href} passHref>
            <h3 className={`${style.link} ${pathname === href ? 'bg-slate-700/50 text-blue-400 sidebar-item-active' : ''}`}>
                <Icon size={20} className={`mr-3 ${pathname === href ? 'text-blue-400' : 'text-slate-300'}`} />
                {label}
            </h3>
        </Link>
    );
};

export default CustomLink;
