'use client';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateCategoryMutation } from '@/redux/api/categoryApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import FormInput from '@/components/reusable/form/FormInputHF';
import toast from 'react-hot-toast';

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
});

interface Category {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

interface EditCategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category;
}

const EditCategoryDialog = ({ isOpen, onClose, category }: EditCategoryDialogProps) => {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
        },
    });

    const [updateCategory, { isLoading }] = useUpdateCategoryMutation();

    // Set initial form values when category changes
    useEffect(() => {
        if (category) {
            form.reset({
                title: category.title,
            });
        }
    }, [category, form]);

    const onSubmit = async (data: { title: string }) => {
        try {
            await updateCategory({
                id: category.id,
                data: {
                    title: data.title.trim(),
                },
            }).unwrap();

            onClose();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to update category');
            console.log(error?.data?.message || 'Failed to update category');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader className="text-center pb-4">
                    <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </div>
                    <DialogTitle className="text-xl font-semibold text-gray-900">Edit Category</DialogTitle>
                    <p className="text-sm text-gray-600 mt-2">Update the category information</p>
                </DialogHeader>

                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <FormInput
                                name="title"
                                label="Category Title"
                                type="text"
                                required
                                placeholder="e.g., Electronics, Clothing, Books"
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center space-x-3 text-sm text-gray-600">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <div>
                                        <span className="font-medium">Created:</span>{' '}
                                        {new Date(category.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                {category.updatedAt !== category.createdAt && (
                                    <div className="flex items-center space-x-3 text-sm text-gray-600 mt-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                        <div>
                                            <span className="font-medium">Last updated:</span>{' '}
                                            {new Date(category.updatedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50">
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Updating...</span>
                                    </div>
                                ) : (
                                    'Update Category'
                                )}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
};

export default EditCategoryDialog;
