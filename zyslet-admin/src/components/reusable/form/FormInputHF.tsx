import React from "react";
import {Controller, useFormContext} from "react-hook-form";

interface FormInputProps {
    name: string;
    label: string;
    type?: "text" | "number" | "email" | "tel" | "url";
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    inputClassName?: string;
    min?: number;
    max?: number;
    step?: number;
}

const FormInput: React.FC<FormInputProps> = ({
    name,
    label,
    type = "text",
    placeholder,
    required = false,
    disabled = false,
    className = "",
    inputClassName = "",
}) => {
    const {control} = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState: {error}}) => (
                <div className={` w-full ${className}`}>
                    <label htmlFor={name} className="text-gray-700 text-base">
                        {label}
                        {required && (
                            <span className="text-red-700 ml-1">*</span>
                        )}
                    </label>

                    <div className="relative mt-1.5">
                        <input
                            {...field}
                            onChange={(e) => {
                                if (type === "number") {
                                    const value = e.target.value;
                                    if (value === "") {
                                        field.onChange(null);
                                    } else {
                                        field.onChange(Number(value));
                                    }
                                } else {
                                    field.onChange(e.target.value);
                                }
                            }}
                            type={type}
                            id={name}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={`border ${
                                disabled
                                    ? "border-slate-200 text-gray-400 cursor-not-allowed"
                                    : "border-slate-400 text-gray-700"
                            } rounded-lg focus:outline-primary w-full h-11 px-4 py-[18px] bg-transparent ${
                                error
                                    ? "border-red-700 focus-visible:ring-red-700"
                                    : ""
                            } ${inputClassName}`}
                        />
                        {error && (
                            <p className="text-red-700 text-sm mt-1">
                                {error.message}
                            </p>
                        )}
                    </div>
                </div>
            )}
        />
    );
};

export default FormInput;
