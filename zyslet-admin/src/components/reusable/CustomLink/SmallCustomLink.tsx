import React, { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const style = {
    link: 'w-full inline-flex items-center py-2 text-sm mb-1 px-4 hover:bg-slate-600/50 rounded-lg text-slate-300 capitalize transition-all duration-200',
};

type NavLinkProps = {
    href: string;
    label: string;
};

const SmallCustomLink: FC<NavLinkProps> = ({ href, label }) => {
    const pathname = usePathname();

    return (
        <Link href={href} passHref>
            <h3 className={`${style.link} ${pathname === href ? 'bg-slate-600/50 text-blue-300' : ''}`}>{label}</h3>
        </Link>
    );
};

export default SmallCustomLink;
