/* eslint-disable @next/next/no-img-element */
import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {FaTimes} from "react-icons/fa";
import {useForm, Controller} from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import {
    useAddDescriptionBlockMutation,
    useUpdateDescriptionBlockMutation,
} from "@/redux/api/productApi";
import toast from "react-hot-toast";
import TextEditor from "@/components/reusable/form/TextEditor";

interface AddEditBlockDialogProps {
    isOpen: boolean;
    onClose: () => void;
    blockData?: any; // Contains _id, title, description, url for existing blocks
    isNewBlock?: boolean;
    product_id?: string;
}

const AddEditBlockDialog = ({
    isOpen,
    onClose,
    blockData,
    isNewBlock = false,
    product_id,
}: AddEditBlockDialogProps) => {
    const {control, handleSubmit, reset} = useForm({
        defaultValues: {
            _id: blockData?._id || "",
            description: blockData?.description || "",
        },
    });

    // Reset form when blockData changes or dialog opens
    useEffect(() => {
        if (isOpen) {
            reset({
                _id: blockData?._id || "",
                description: blockData?.description || "",
            });

            // Set image preview from URL for existing blocks
            if (blockData?.url) setImagePreview(blockData.url);
            else setImagePreview(null);

            setImage(null);
        }
    }, [blockData, isOpen, reset]);

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const [createDescriptionBlock] = useAddDescriptionBlockMutation();

    const [updateDescriptionBlock] = useUpdateDescriptionBlockMutation();

    const onSubmit = async (data: any) => {
        console.log(data);
        const formData = new FormData();

        // Add basic fields
        formData.append("description", data.description || "");
        formData.append("product_id", product_id || "");
        formData.append("id", blockData?._id || "");

        // Add image if selected
        if (image) {
            formData.append("image", image);
        } else {
            formData.append("image", blockData?.url);
        }

        if (isNewBlock) {
            const response = await createDescriptionBlock(formData);
            if (response.data?.success) {
                toast.success("Block created successfully");
                onClose();
            } else {
                toast.error(response.data?.message);
            }
        } else {
            const response = await updateDescriptionBlock(formData);
            if (response.data?.success) {
                toast.success("Block updated successfully");
                onClose();
            } else {
                toast.error(response.data?.message);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        {isNewBlock ? "Add New Block" : "Edit Block"}
                    </DialogTitle>
                    <DialogClose
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-700">
                        <FaTimes />
                    </DialogClose>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Hidden field for _id */}
                    {!isNewBlock && blockData?._id && (
                        <Controller
                            control={control}
                            name="_id"
                            render={({field}) => (
                                <input type="hidden" {...field} />
                            )}
                        />
                    )}

                    {/* Description Input */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700">
                            Description
                        </label>
                        <Controller
                            control={control}
                            name="description"
                            render={({field}) => (
                                <TextEditor
                                    id="description-editor"
                                    value={field.value}
                                    onChange={(value) => {
                                        field.onChange(value);
                                    }}
                                />
                            )}
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-2">
                            Image
                        </label>

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="mb-3 border rounded-md p-2 bg-gray-50">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-40 object-contain"
                                />
                                {!isNewBlock && blockData?.url && !image && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Current image
                                    </p>
                                )}
                                {image && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        New image selected
                                    </p>
                                )}
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            className="w-full border border-slate-300 rounded-md p-2"
                            onChange={handleImageChange}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {isNewBlock
                                ? "Please select an image for the block"
                                : "Choose a new image to replace the current one"}
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="w-32">
                            Cancel
                        </Button>
                        <Button type="submit" className="w-32">
                            {isNewBlock ? "Add Block" : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddEditBlockDialog;
