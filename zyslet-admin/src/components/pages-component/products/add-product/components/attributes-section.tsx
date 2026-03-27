"use client";

import {useFormContext, useFieldArray} from "react-hook-form";
import {useState, KeyboardEvent} from "react";
import {FaPlus, FaTrash, FaTimes} from "react-icons/fa";
import {SectionTitle} from "./section-title";

export function AttributesSection() {
    const {
        control,
        register,
        setValue,
        getValues,
        formState: {errors},
    } = useFormContext();

    const {
        fields: attributeFields,
        append: appendAttribute,
        remove: removeAttribute,
    } = useFieldArray({
        control,
        name: "attributes",
    });

    const [inputValues, setInputValues] = useState<Record<number, string>>({});

    const handleValueKeyDown = (
        e: KeyboardEvent<HTMLInputElement>,
        attrIndex: number
    ) => {
        if (e.key === "Enter" && inputValues[attrIndex]?.trim()) {
            e.preventDefault();
            const values = getValues(`attributes.${attrIndex}.values`) || [];
            const newValues = [...values, inputValues[attrIndex].trim()];
            setValue(`attributes.${attrIndex}.values`, newValues);
            setInputValues({...inputValues, [attrIndex]: ""});
        }
    };

    const handleRemoveValue = (attrIndex: number, valueIndex: number) => {
        const values = getValues(`attributes.${attrIndex}.values`) || [];
        const newValues = values.filter(
            (_: string, i: number) => i !== valueIndex
        );
        setValue(`attributes.${attrIndex}.values`, newValues, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        });
    };

    return (
        <section className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <SectionTitle title="Attributes" />
                <button
                    type="button"
                    onClick={() => appendAttribute({title: "", values: []})}
                    className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-md transition-colors">
                    <FaPlus size={12} className="mr-1" /> Add Attribute
                </button>
            </div>

            <div className="space-y-6">
                {attributeFields.map((field, attrIndex) => (
                    <div
                        key={field.id}
                        className="border border-gray-200 p-4 rounded-lg bg-gray-50 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Attribute Title */}
                            <div>
                                <label className="block text-gray-700 mb-1.5">
                                    Attribute Title
                                </label>
                                <input
                                    {...register(
                                        `attributes.${attrIndex}.title`
                                    )}
                                    className="border border-slate-400 rounded-lg focus:outline-primary text-gray-700 w-full px-4 h-11 bg-white"
                                    placeholder="e.g., Color, Size"
                                />
                                {Array.isArray(errors.attributes) &&
                                    errors.attributes[attrIndex]?.title && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {
                                                errors.attributes[attrIndex]
                                                    ?.title?.message
                                            }
                                        </p>
                                    )}
                            </div>

                            {/* Attribute Value Input */}
                            <div>
                                <label className="block text-gray-700 mb-1.5">
                                    Attribute Values (press Enter to add)
                                </label>
                                <input
                                    type="text"
                                    value={inputValues[attrIndex] || ""}
                                    onChange={(e) =>
                                        setInputValues({
                                            ...inputValues,
                                            [attrIndex]: e.target.value,
                                        })
                                    }
                                    onKeyDown={(e) =>
                                        handleValueKeyDown(e, attrIndex)
                                    }
                                    placeholder="e.g., Red, Large"
                                    className="border border-slate-400 rounded-lg focus:outline-primary text-gray-700 w-full px-4 h-11 bg-white"
                                />
                            </div>
                        </div>

                        {/* Values Display */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {(
                                getValues(`attributes.${attrIndex}.values`) ||
                                []
                            ).map((value: string, valueIndex: number) => (
                                <div
                                    key={valueIndex}
                                    className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 shadow-sm">
                                    <span className="text-sm">{value}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleRemoveValue(
                                                attrIndex,
                                                valueIndex
                                            );
                                        }}
                                        className="ml-2 text-red-500 hover:text-red-700">
                                        <FaTimes size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Remove Attribute */}
                        <button
                            type="button"
                            onClick={() => removeAttribute(attrIndex)}
                            className="absolute -top-2 -right-2 bg-red-100 text-red-500 hover:text-red-700 p-1 rounded-full">
                            <FaTrash size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
