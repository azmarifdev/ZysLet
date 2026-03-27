/* eslint-disable @next/next/no-img-element */
"use client";

import {useFormContext, useFieldArray} from "react-hook-form";
import {FaPlus, FaTrash} from "react-icons/fa";
import {SectionTitle} from "./section-title";
import {useState} from "react";
import TextEditor from "@/components/reusable/form/TextEditor";

export function DescriptionBlocksSection() {
    const {
        control,
        setValue,
        trigger,
        watch,
        formState: {errors},
    } = useFormContext();

    const {
        fields: blockFields,
        append: appendBlock,
        remove: removeBlock,
    } = useFieldArray({
        control,
        name: "description_blocks",
    });

    const watchedBlocks = watch("description_blocks");
    const [imagePreviews, setImagePreviews] = useState<Record<number, string>>(
        {}
    );

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const updatedBlocks = [...(watchedBlocks || [])];
            updatedBlocks[index] = {
                ...updatedBlocks[index],
                image: file,
            };

            setValue("description_blocks", updatedBlocks, {
                shouldValidate: true,
            });

            // 👇 Trigger validation for this specific image field
            trigger(`description_blocks.${index}.image`);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => ({
                    ...prev,
                    [index]: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <section className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <SectionTitle title="Description Blocks" />
                <button
                    type="button"
                    onClick={() =>
                        appendBlock({title: "", description: "", image: null})
                    }
                    className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-md transition-colors">
                    <FaPlus size={12} className="mr-1" /> Add Block
                </button>
            </div>

            <div className="space-y-6">
                {blockFields.map((field, index) => (
                    <div
                        key={field.id}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                        <div className="mt-4">
                            <label className="block text-gray-700 mb-1.5">
                                Description
                            </label>

                            <TextEditor
                                id={`description-editor-${index}`}
                                value={
                                    watchedBlocks?.[index]?.description || ""
                                }
                                onChange={(value) => {
                                    setValue(
                                        `description_blocks.${index}.description`,
                                        value
                                    );
                                }}
                            />
                        </div>

                        {/* Image */}
                        <div>
                            <label className="block text-gray-700 mb-1.5 mt-4">
                                Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, index)}
                                className="w-full text-gray-700"
                            />
                            {Array.isArray(errors.description_blocks) &&
                                errors.description_blocks[index]?.image && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {
                                            errors.description_blocks[index]
                                                ?.image?.message
                                        }
                                    </p>
                                )}

                            {imagePreviews[index] && (
                                <div className="mt-2">
                                    <img
                                        src={imagePreviews[index]}
                                        alt={`Preview ${index}`}
                                        className="h-24 object-contain rounded border border-gray-300"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Remove Button */}
                        <button
                            type="button"
                            onClick={() => removeBlock(index)}
                            className="absolute -top-2 -right-2 bg-red-100 text-red-500 hover:text-red-700 p-1 rounded-full">
                            <FaTrash size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
