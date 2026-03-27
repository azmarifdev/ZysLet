'use client';
import { useState, useEffect } from 'react';
import type React from 'react';

import { useForm } from 'react-hook-form';
import { FaTimes, FaCamera, FaTrash, FaUser } from 'react-icons/fa';
import Image from 'next/image';
import { useUpdateUserMutation } from '@/redux/api/authApi';
import toast from 'react-hot-toast';

interface UpdateProfileModalProps {
    isOpen: boolean;
    // eslint-disable-next-line no-unused-vars
    setIsOpen: (isOpen: boolean) => void;
    userData: {
        name: string;
        email: string;
        profile_image: string | null;
    };
}

interface FormValues {
    name: string;
    email: string;
}

const UpdateProfileModal = ({ isOpen, setIsOpen, userData }: UpdateProfileModalProps) => {
    const [profileImage, setProfileImage] = useState<string | null>(userData.profile_image);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormValues>({
        defaultValues: {
            name: userData.name,
            email: userData.email,
        },
    });

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            reset({
                name: userData.name,
                email: userData.email,
            });
            setProfileImage(userData.profile_image);
            setImageFile(null);
        }
    }, [isOpen, reset, userData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);

            // Create a preview URL
            const reader = new FileReader();
            reader.onload = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
        setImageFile(null);
        true;
    };

    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const onSubmit = async (data: FormValues) => {
        try {
            // Combine form data with image information
            const formData = new FormData();
            formData.append('name', data.name || userData.name);
            formData.append('email', data.email || userData.email);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            console.log('Submitting profile update:', {
                name: data.name || userData.name,
                email: data.email || userData.email,
                hasImage: !!imageFile,
            });

            const res: any = await updateUser(formData);

            console.log('Update response:', res);

            if (res.data?.success) {
                toast.success('Profile updated successfully');
                setIsOpen(false);
            } else {
                // Better error handling
                const errorMessage =
                    res.error?.data?.message || res.error?.message || 'Failed to update profile. Please try again.';
                toast.error(errorMessage);
                console.error('Profile update error:', res.error);
            }
        } catch (error) {
            console.error('Profile update catch error:', error);
            toast.error('An unexpected error occurred. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn"
                onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Update Profile</h3>
                    <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Profile Image Section */}
                        <div className="mb-6 flex flex-col items-center">
                            <div className="relative mb-4">
                                {profileImage ? (
                                    <div className="relative">
                                        <Image
                                            src={profileImage || '/placeholder.svg'}
                                            alt="Profile Preview"
                                            width={100}
                                            height={100}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors">
                                            <FaTrash className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                                        <FaUser className="w-10 h-10 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors">
                                <FaCamera className="w-4 h-4" />
                                <span className="text-sm font-medium">Upload Image</span>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        </div>

                        {/* Name Field */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                {...register('name', {
                                    required: 'Name is required',
                                    minLength: {
                                        value: 2,
                                        message: 'Name must be at least 2 characters',
                                    },
                                })}
                                className={`w-full px-4 py-2 border ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                        </div>

                        {/* Email Field */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                                className={`w-full px-4 py-2 border ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-colors">
                                {isLoading ? 'Updating...' : 'Update Profile'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfileModal;
