"use client";

import {useFormContext} from "react-hook-form";
import FormInput from "@/components/reusable/form/FormInputHF";
import TextEditor from "@/components/reusable/form/TextEditor";
import {SectionTitle} from "./section-title";

interface ProductDetailsSectionProps {
    mainFeatures: string;
    importantNote: string;
    // eslint-disable-next-line no-unused-vars
    onMainFeaturesChange: (value: string) => void;
    // eslint-disable-next-line no-unused-vars
    onImportantNoteChange: (value: string) => void;
}

export function ProductDetailsSection({
    mainFeatures,
    importantNote,
    onMainFeaturesChange,
    onImportantNoteChange,
}: ProductDetailsSectionProps) {
    const {
        formState: {errors},
    } = useFormContext();

    return (
        <section className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
            <SectionTitle title="Product Details" />
            <div className="space-y-6">
                <FormInput
                    name="youtube_video"
                    label="YouTube Video URL"
                    placeholder="Enter YouTube video URL"
                    type="url"
                />

                {/* Important Note - Text Editor */}
                <div>
                    <label
                        htmlFor="important_note"
                        className="block text-gray-700 mb-1.5">
                        Important Note
                    </label>
                    <TextEditor
                        id="important-note-editor"
                        value={importantNote}
                        onChange={onImportantNoteChange}
                    />

                    {errors.important_note && (
                        <p className="mt-1 text-sm text-red-600">
                            {typeof errors.important_note?.message ===
                                "string" && errors.important_note.message}
                        </p>
                    )}
                </div>
                {/* Main Features - Text Editor */}
                <div>
                    <label
                        htmlFor="main_features"
                        className="block text-gray-700 mb-1.5">
                        Main Features
                    </label>
                    <TextEditor
                        id="main-features-editor"
                        value={mainFeatures}
                        onChange={onMainFeaturesChange}
                    />
                    {errors.main_features && (
                        <p className="mt-1 text-sm text-red-600">
                            {typeof errors.main_features?.message ===
                                "string" && errors.main_features.message}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
