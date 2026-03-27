"use client";
import {useForm} from "react-hook-form";
import {FaTimes, FaEye, FaEyeSlash} from "react-icons/fa";
import {useState} from "react";
import {useChangePasswordMutation} from "@/redux/api/authApi";
import toast from "react-hot-toast";

interface ChangePasswordModalProps {
    isOpen: boolean;
    // eslint-disable-next-line no-unused-vars
    setIsOpen: (isOpen: boolean) => void;
}

interface FormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ChangePasswordModal = ({isOpen, setIsOpen}: ChangePasswordModalProps) => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
        watch,
        reset,
    } = useForm<FormValues>();

    const newPassword = watch("newPassword", "");

    const [changePassword, {isLoading}] = useChangePasswordMutation();

    const onSubmit = async (data: FormValues) => {
        const credentials = {
            oldPassword: data.currentPassword,
            newPassword: data.newPassword,
        };
        const res: any = await changePassword(credentials);
        if (res.data?.success) {
            toast.success("Password updated successfully");
            reset();
            setIsOpen(false);
        } else {
            toast.error(res.error?.message);
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
                    <h3 className="text-xl font-bold text-white">
                        Change Password
                    </h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-gray-200 transition-colors">
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Current Password Field */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={
                                        showCurrentPassword
                                            ? "text"
                                            : "password"
                                    }
                                    {...register("currentPassword", {
                                        required:
                                            "Current password is required",
                                    })}
                                    className={`w-full px-4 py-2 border ${
                                        errors.currentPassword
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() =>
                                        setShowCurrentPassword(
                                            !showCurrentPassword
                                        )
                                    }>
                                    {showCurrentPassword ? (
                                        <FaEyeSlash className="w-4 h-4" />
                                    ) : (
                                        <FaEye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.currentPassword.message}
                                </p>
                            )}
                        </div>

                        {/* New Password Field */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    {...register("newPassword", {
                                        required: "New password is required",
                                        minLength: {
                                            value: 6,
                                            message:
                                                "Password must be at least 6 characters",
                                        },
                                    })}
                                    className={`w-full px-4 py-2 border ${
                                        errors.newPassword
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() =>
                                        setShowNewPassword(!showNewPassword)
                                    }>
                                    {showNewPassword ? (
                                        <FaEyeSlash className="w-4 h-4" />
                                    ) : (
                                        <FaEye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    {...register("confirmPassword", {
                                        required:
                                            "Please confirm your password",
                                        validate: (value) =>
                                            value === newPassword ||
                                            "Passwords do not match",
                                    })}
                                    className={`w-full px-4 py-2 border ${
                                        errors.confirmPassword
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }>
                                    {showConfirmPassword ? (
                                        <FaEyeSlash className="w-4 h-4" />
                                    ) : (
                                        <FaEye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Password Requirements */}
                        <div className="mb-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                            <p className="font-medium mb-2">
                                Password must contain:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>At least 6 characters</li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-colors">
                                {isLoading ? "Updating..." : "Update Password"}
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

export default ChangePasswordModal;
