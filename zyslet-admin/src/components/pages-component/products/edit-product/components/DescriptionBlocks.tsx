/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getImageUrl } from '@/lib/imageUtils';

import { useDeleteDescriptionBlockMutation } from '@/redux/api/productApi';
import { SectionTitle } from '../../add-product/components/section-title';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AddEditBlockDialog from './AddEditBlockDialog';
import DeleteConfirmDialog from '@/components/pages-component/category/DeleteConfirmDialog';
import ConvertHtml from '@/components/shared/ConvertHtml';

const schema = z.object({
    description_blocks: z
        .array(
            z.object({
                _id: z.string().optional(),

                description: z.string().optional(),
                url: z.string().optional(),
                image: z
                    .any()
                    .optional()
                    .superRefine((file, ctx) => {
                        // Check if there's a URL in the form data or file is a File instance
                        if ((typeof file === 'string' && file.startsWith('http')) || file instanceof File) {
                            return true;
                        }

                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Image is required when no URL is provided',
                        });
                        return false;
                    })
                    .optional(),
            }),
        )
        .optional(),
});

type DescriptionBlocksFormValues = z.infer<typeof schema>;

interface DescriptionBlock {
    _id: string;
    title: string;
    description?: string;
    url?: string;
    product_id?: string;
}

export function DescriptionBlocksSection({
    product,
    onPrev,
    onNext,
}: {
    product?: any;
    onPrev?: () => void;
    onNext?: () => void;
}) {
    const form = useForm<DescriptionBlocksFormValues>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        defaultValues: {
            description_blocks: [],
        },
    });

    const { control, setValue, watch } = form;
    const { fields: blockFields } = useFieldArray({
        control,
        name: 'description_blocks',
    });

    // Load description blocks when product data is available
    useEffect(() => {
        if (product?.description_blocks?.length) {
            setValue(
                'description_blocks',
                product.description_blocks.map((block: DescriptionBlock) => ({
                    _id: block._id,
                    title: block.title,
                    description: block.description || '',
                    url: block.url || '',
                })),
            );
        }
    }, [product, setValue]);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentBlock, setCurrentBlock] = useState<any>(null);

    // API hooks
    const [deleteDescriptionBlock, { isLoading: isDeleting }] = useDeleteDescriptionBlockMutation();

    // Handle deleting a block
    const handleDeleteBlock = async (blockId: string) => {
        const response = await deleteDescriptionBlock(blockId);
        if (response?.data?.success) {
            toast.success('Block deleted successfully.');
            setIsDeleteDialogOpen(false);

            // Update the form state by removing the deleted block
            const updatedBlocks = watch('description_blocks')?.filter((block) => block._id !== blockId) || [];
            setValue('description_blocks', updatedBlocks);
        } else {
            toast.error('Failed to delete block');
        }
    };

    // Handle opening the edit modal
    const handleEditClick = (block: any) => {
        setCurrentBlock(block);
        setIsEditModalOpen(true);
    };

    // Handle opening the delete confirmation dialog
    const handleDeleteClick = (block: any) => {
        setCurrentBlock(block);
        setIsDeleteDialogOpen(true);
    };

    // Form submission handler
    const onSubmit = async () => {
        // This function is now just a placeholder since we handle form submission
        // directly in the modal components
        console.log('Main form submitted');
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <section className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <SectionTitle title="Description Blocks" />
                        <Button type="button" onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
                            <FaPlus size={12} /> Add New Block
                        </Button>
                    </div>

                    {/* Preview Grid for Description Blocks */}
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        {blockFields.length === 0 ? (
                            <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <p className="text-gray-500">No description blocks added yet.</p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="mt-2">
                                    Add Your First Block
                                </Button>
                            </div>
                        ) : (
                            blockFields.map((block, index) => (
                                <div key={block.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                                    {/* Description */}
                                    {block?.description && (
                                        <div className="mt-4">
                                            <label className="block font-medium text-gray-700 mb-1.5">Description</label>
                                            <ConvertHtml content={block?.description || ''} />
                                        </div>
                                    )}

                                    {block?.url && (
                                        <div className="mt-4">
                                            <label className="block font-medium text-gray-700 mb-1.5">Image</label>
                                            {block.url ? (
                                                <div className="mt-2">
                                                    <img
                                                        src={getImageUrl(block.url)}
                                                        alt={`Preview ${index}`}
                                                        className="h-24 object-contain rounded border border-gray-300"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-24 flex items-center justify-center border border-gray-300 rounded">
                                                    <p className="text-gray-500">No image</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEditClick({
                                                _id: watch(`description_blocks.${index}._id`),
                                                description: watch(`description_blocks.${index}.description`),
                                                url: watch(`description_blocks.${index}.url`),
                                                product_id: product?._id,
                                            })
                                        }
                                        className="absolute top-2 right-10 bg-blue-100 text-blue-500 hover:text-blue-700 p-1 rounded-full">
                                        <FaEdit size={12} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteClick({
                                                _id: watch(`description_blocks.${index}._id`),
                                            })
                                        }
                                        className="absolute top-2 right-2 bg-red-100 text-red-500 hover:text-red-700 p-1 rounded-full">
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-end space-x-4 mt-8">
                        {onPrev && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onPrev}
                                className="px-6 py-2 border-primary !text-primary">
                                Prev
                            </Button>
                        )}

                        {onNext && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onNext}
                                className="px-6 py-2 border-primary !text-primary">
                                Next
                            </Button>
                        )}
                    </div>
                </section>
            </form>

            {/* Add Block Modal */}
            <AddEditBlockDialog
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                blockData={null}
                isNewBlock={true}
                product_id={product?._id}
            />

            {/* Edit Block Modal */}
            <AddEditBlockDialog
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                blockData={currentBlock}
                isNewBlock={false}
            />

            {/* Delete Confirmation Dialog */}
            {isDeleteDialogOpen && (
                <DeleteConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={() => handleDeleteBlock(currentBlock?._id)}
                    isDeleting={isDeleting}
                />
            )}
        </FormProvider>
    );
}
