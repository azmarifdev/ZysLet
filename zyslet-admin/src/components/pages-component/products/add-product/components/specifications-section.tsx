"use client";

import {useFormContext, useFieldArray} from "react-hook-form";
import {FaPlus, FaTrash} from "react-icons/fa";
import {SectionTitle} from "./section-title";

export function SpecificationsSection() {
    const {
        control,
        register,
        formState: {errors},
    } = useFormContext();

    const {
        fields: specificationFields,
        append: appendSpecification,
        remove: removeSpecification,
    } = useFieldArray({
        control,
        name: "specifications",
    });

    return (
        <section className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <SectionTitle title="Specifications" />
                <button
                    type="button"
                    onClick={() => appendSpecification({key: "", value: ""})}
                    className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-md transition-colors">
                    <FaPlus size={12} className="mr-1" /> Add Specification
                </button>
            </div>

            <div className="space-y-4">
                {specificationFields.map((field, index) => (
                    <div
                        key={field.id}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div>
                            <label className="block text-gray-700 mb-1.5">
                                Key
                            </label>
                            <input
                                {...register(`specifications.${index}.key`)}
                                className="border border-slate-400 rounded-lg focus:outline-primary text-gray-700 w-full px-4 h-11 bg-white"
                                placeholder="Specification key"
                            />
                            {Array.isArray(errors.specifications) &&
                                errors.specifications[index]?.key && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {
                                            errors.specifications[index]?.key
                                                ?.message
                                        }
                                    </p>
                                )}
                        </div>
                        <div className="relative">
                            <label className="block text-gray-700 mb-1.5">
                                Value
                            </label>
                            <input
                                {...register(`specifications.${index}.value`)}
                                className="border border-slate-400 rounded-lg focus:outline-primary text-gray-700 w-full px-4 h-11 bg-white"
                                placeholder="Specification value"
                            />
                            {Array.isArray(errors.specifications) &&
                                errors.specifications[index]?.value && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {
                                            errors.specifications[index]?.value
                                                ?.message
                                        }
                                    </p>
                                )}
                            {index >= 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeSpecification(index)}
                                    className="absolute -top-2 -right-2 bg-red-100 text-red-500 hover:text-red-700 p-1 rounded-full">
                                    <FaTrash size={12} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
