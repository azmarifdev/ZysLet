import Image from 'next/image';
import avatar from '@/assets/default-avatar.png';
import Link from 'next/link';
import { BsGrid } from 'react-icons/bs';
import { FiLogOut } from 'react-icons/fi';
import React from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { useAppSelector } from '@/redux/hooks';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { getImageUrl } from '@/lib/imageUtils';

interface DropdownProps {
    handleLogout: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ handleLogout }) => {
    const { user } = useAppSelector((state) => state.auth);

    return (
        <Popover>
            <PopoverTrigger className="flex space-x-4 items-center justify-center border-2 rounded-[8px] border-slate-400 px-3 py-1.5">
                {user?.profile_image ? (
                    <img className="rounded-full h-8 w-8 object-cover" src={getImageUrl(user.profile_image)} alt="user" />
                ) : (
                    <Image className="rounded-full h-8 w-8" src={avatar} height={32} width={32} alt="user" />
                )}
                <div className="flex space-x-2 items-center justify-center">
                    <h3 className="font-onest text-sm capitalize">{user?.name}</h3>
                    <FaAngleDown className="text-black text-base" />
                </div>
            </PopoverTrigger>

            <PopoverContent align="center" className="bg-white rounded-[4px] mt-2 w-[160px] text-black py-2 px-4">
                <Link href="/dashboard" className="cursor-pointer mb-2 w-full inline-flex items-center justify-center">
                    <BsGrid size={14} className="mr-2" /> Dashboard
                </Link>
                <li onClick={handleLogout} className="cursor-pointer w-full inline-flex items-center justify-center">
                    <FiLogOut size={14} className="mr-2" />
                    LogOut
                </li>
            </PopoverContent>
        </Popover>
    );
};

export default Dropdown;
