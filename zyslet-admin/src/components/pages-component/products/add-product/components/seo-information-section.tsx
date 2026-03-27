"use client";

import type {KeyboardEvent} from "react";
import {useFormContext} from "react-hook-form";
import {FaTimes} from "react-icons/fa";
import {SectionTitle} from "./section-title";

interface SEOInformationSectionProps {
    metaKeywordInput: string;
    metaKeywords: string[];
    // eslint-disable-next-line no-unused-vars
    setMetaKeywordInput: (value: string) => void;
    // eslint-disable-next-line no-unused-vars
    handleMetaKeywordKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    // eslint-disable-next-line no-unused-vars
    removeMetaKeyword: (index: number) => void;
}

export function SEOInformationSection({
    metaKeywordInput,
    metaKeywords,
    setMetaKeywordInput,
    handleMetaKeywordKeyDown,
    removeMetaKeyword,
}: SEOInformationSectionProps) {
    const {register} = useFormContext();

    return (
        <section className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
            <SectionTitle title="SEO Information" />
            <div className="space-y-6">
                <div>
                    <label
                        htmlFor="meta_desc"
                        className="block text-gray-700 mb-1.5">
                        Meta Description
                    </label>
                    <textarea
                        id="meta_desc"
                        className="border border-slate-400 rounded-lg focus:outline-primary text-gray-700 w-full px-4 bg-transparent py-2"
                        placeholder="Enter meta description"
                        rows={3}
                        {...register("meta_desc")}
                    />
                </div>

                <div>
                    <label
                        htmlFor="meta_keywords"
                        className="block text-gray-700 mb-1.5">
                        Meta Keywords (press Enter to add)
                    </label>
                    <input
                        id="meta_keywords"
                        className="border border-slate-400 rounded-lg focus:outline-primary text-gray-700 w-full px-4 h-11 bg-transparent"
                        placeholder="Type and press Enter to add"
                        value={metaKeywordInput}
                        onChange={(e) => setMetaKeywordInput(e.target.value)}
                        onKeyDown={handleMetaKeywordKeyDown}
                    />

                    {/* Display meta keywords */}
                    {metaKeywords.length > 0 && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-md">
                            <div className="flex flex-wrap gap-2">
                                {metaKeywords.map((keyword, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
                                        <span className="text-sm">
                                            {keyword}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeMetaKeyword(index)
                                            }
                                            className="ml-2 text-red-500 hover:text-red-700">
                                            <FaTimes size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_published"
                            className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                            {...register("is_published")}
                        />
                        <label
                            htmlFor="is_published"
                            className="ml-2 block text-gray-700">
                            Publish immediately
                        </label>
                    </div>
                </div>
            </div>
        </section>
    );
}
