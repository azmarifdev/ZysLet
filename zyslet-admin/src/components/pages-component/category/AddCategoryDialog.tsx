'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddCategoryMutation } from '@/redux/api/categoryApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import FormInput from '@/components/reusable/form/FormInputHF';
import toast from 'react-hot-toast';

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
});

interface AddCategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddCategoryDialog = ({ isOpen, onClose }: AddCategoryDialogProps) => {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
        },
    });

    const [addCategory, { isLoading }] = useAddCategoryMutation();

    const onSubmit = async (data: { title: string }) => {
        try {
            await addCategory(data).unwrap();
            form.reset();
            toast.success('Category added successfully');
            onClose();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to add category');
            console.log(error?.data?.message || 'Failed to add category');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader className="text-center pb-4">
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                    </div>
                    <DialogTitle className="text-xl font-semibold text-gray-900">Add New Category</DialogTitle>
                    <p className="text-sm text-gray-600 mt-2">Create a new category to organize your products</p>
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
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <div>
                                        <h4 className="text-sm font-medium text-blue-900">Tips for naming categories:</h4>
                                        <ul className="text-sm text-blue-700 mt-1 space-y-1">
                                            <li>• Use clear, descriptive names</li>
                                            <li>• Keep it concise and memorable</li>
                                            <li>• Avoid special characters</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset();
                                    onClose();
                                }}
                                className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
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
                                        <span>Creating...</span>
                                    </div>
                                ) : (
                                    'Create Category'
                                )}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
};

export default AddCategoryDialog;
