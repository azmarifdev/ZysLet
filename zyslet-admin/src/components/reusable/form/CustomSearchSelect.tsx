"use client";
import {cn} from "@/lib/utils";
import React, {useEffect, useState, useRef} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {FaAngleDown} from "react-icons/fa6";
import {IoMdClose} from "react-icons/io";

interface OptionType {
    value: string;
    label: string;
}

interface CustomSearchSelectProps {
    name: string;
    label?: string;
    options: OptionType[];
    placeholder?: string;
    defaultValue?: OptionType | OptionType[];
    // eslint-disable-next-line no-unused-vars
    onChange?: (value: OptionType | OptionType[]) => void;
    required?: boolean;
    disabled?: boolean;
    searchable?: boolean;
    // eslint-disable-next-line no-unused-vars
    onSearch?: (value: string) => void;
    errorMessage?: string;
    isMulti?: boolean;
}

const CustomSearchSelect: React.FC<CustomSearchSelectProps> = ({
    name,
    label,
    options,
    placeholder,
    defaultValue,
    onChange,
    required = false,
    disabled = false,
    searchable = false,
    onSearch,
    errorMessage,
    isMulti = false,
}) => {
    const {
        control,
        formState: {errors},
        watch,
    } = useFormContext();
    const error = errors[name];
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [displayValue, setDisplayValue] = useState("");
    const [lastValidValue, setLastValidValue] = useState<OptionType | null>(
        null
    );
    const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Watch for changes in the form value
    const fieldValue = watch(name);

    // Initialize and update display value
    useEffect(() => {
        if (isMulti) {
            if (Array.isArray(fieldValue)) {
                setSelectedOptions(fieldValue);
            } else if (Array.isArray(defaultValue)) {
                setSelectedOptions(defaultValue);
            }
        } else {
            const currentValue = fieldValue || defaultValue;
            if (currentValue) {
                setDisplayValue(currentValue.label);
                setLastValidValue(currentValue);
            }
        }
    }, [fieldValue, defaultValue, isMulti]);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setDisplayValue(value);
        onSearch?.(value);

        // Keep dropdown open when text changes (including when cleared)
        if (!open) setOpen(true);
    };

    // Handle trigger input focus
    const handleFocus = () => {
        if (!disabled) {
            setOpen(true);
            setInputValue(""); // Clear input when focusing to show all options
        }
    };

    // Handle trigger input blur
    const handleBlur = () => {
        setTimeout(() => {
            if (open) setOpen(false);

            // If input is empty or doesn't match any option, revert to last valid value
            if (
                !isMulti &&
                (!displayValue ||
                    !options.some((opt) => opt.label === displayValue))
            ) {
                setDisplayValue(lastValidValue?.label || "");
                setInputValue("");
            }
        }, 200);
    };

    // Auto-focus on input when dropdown opens
    useEffect(() => {
        if (open && searchable && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open, searchable]);

    // Handle clicks outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [open]);

    // Filtered options based on search
    const filteredOptions = options?.filter((option) => {
        // If multi-select, don't show already selected options
        if (
            isMulti &&
            selectedOptions.some((item) => item.value === option.value)
        ) {
            return false;
        }

        return !inputValue
            ? true
            : option.label.toLowerCase().includes(inputValue.toLowerCase());
    });

    return (
        <div className="space-y-2 w-full">
            <label className="block text-black text-base font-medium">
                {label}
                {required && <span className="text-red-700 ml-1">*</span>}
            </label>
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                render={({field}) => {
                    // Select an option
                    const selectOption = (option: OptionType) => {
                        if (isMulti) {
                            const newSelectedOptions = [
                                ...selectedOptions,
                                option,
                            ];
                            setSelectedOptions(newSelectedOptions);
                            onChange?.(newSelectedOptions);
                            field.onChange(newSelectedOptions); // Make sure the form field is updated
                            setInputValue("");
                            // Keep dropdown open for multi-select
                        } else {
                            onChange?.(option);
                            field.onChange(option); // Make sure the form field is updated
                            setDisplayValue(option.label);
                            setLastValidValue(option);
                            setInputValue("");
                            setOpen(false);
                        }
                    };

                    // Remove a selected option (for multi-select)
                    const removeOption = (
                        optionToRemove: OptionType,
                        e: React.MouseEvent
                    ) => {
                        e.stopPropagation();
                        const newSelectedOptions = selectedOptions.filter(
                            (option) => option.value !== optionToRemove.value
                        );
                        setSelectedOptions(newSelectedOptions);
                        onChange?.(newSelectedOptions);
                        field.onChange(newSelectedOptions); // Update the form field value
                    };

                    return (
                        <div ref={containerRef} className="relative">
                            {/* Custom Select Trigger - Input when searchable */}
                            {searchable ? (
                                <div
                                    className={cn(
                                        "flex  items-center w-full min-h-12 px-4 py-2 rounded-lg border text-sm font-normal bg-transparent",
                                        error || errorMessage
                                            ? "border-red-700 focus:ring-red-700"
                                            : "border-[#cfcfcf]",
                                        disabled &&
                                            "opacity-50 cursor-not-allowed"
                                    )}>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        className="w-full outline-none bg-transparent"
                                        placeholder={
                                            placeholder ||
                                            (isMulti
                                                ? "Search and select items..."
                                                : "Type to search...")
                                        }
                                        value={displayValue}
                                        onChange={handleSearchChange}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        disabled={disabled}
                                    />
                                    <FaAngleDown
                                        className={cn(
                                            "text-gray-800 flex-shrink-0",
                                            open && "transform rotate-180"
                                        )}
                                        size={15}
                                        onClick={() =>
                                            !disabled && setOpen(!open)
                                        }
                                    />
                                </div>
                            ) : (
                                <div className="flex justify-between items-center w-full min-h-12 px-4 py-2 rounded-lg border text-sm font-normal bg-transparent cursor-pointer">
                                    <div
                                        className={cn(
                                            "flex  justify-between items-center w-full min-h-12 px-4 py-2 rounded-lg border text-sm font-normal bg-transparent cursor-pointer",
                                            error || errorMessage
                                                ? "border-red-700 focus:ring-red-700"
                                                : "border-[#cfcfcf]",
                                            disabled &&
                                                "opacity-50 cursor-not-allowed"
                                        )}
                                        onClick={() =>
                                            !disabled && setOpen(!open)
                                        }>
                                        {!isMulti && (
                                            <div className="truncate w-full">
                                                {field.value &&
                                                "label" in field.value
                                                    ? field.value.label
                                                    : defaultValue &&
                                                      !Array.isArray(
                                                          defaultValue
                                                      )
                                                    ? defaultValue.label
                                                    : placeholder ||
                                                      "Select an option"}
                                            </div>
                                        )}
                                    </div>
                                    <FaAngleDown
                                        className={cn(
                                            "text-gray-800 flex-shrink-0 ml-2",
                                            open && "transform rotate-180"
                                        )}
                                        size={15}
                                    />
                                </div>
                            )}

                            {/* Custom Dropdown - Always show when open */}
                            {open && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-auto">
                                    {/* Options List - Show all when input is empty */}
                                    <div>
                                        {filteredOptions?.length > 0 ? (
                                            filteredOptions?.map((option) => (
                                                <div
                                                    key={option.value}
                                                    className="px-4 py-1.5 text-sm cursor-pointer hover:bg-pink-50"
                                                    onClick={() => {
                                                        if (isMulti) {
                                                            const newValue = [
                                                                ...selectedOptions,
                                                                option,
                                                            ];
                                                            field.onChange(
                                                                newValue
                                                            );
                                                        } else {
                                                            field.onChange(
                                                                option
                                                            );
                                                        }
                                                        selectOption(option);
                                                    }}
                                                    onMouseDown={(e) =>
                                                        e.preventDefault()
                                                    }>
                                                    {option.label}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-2 text-center text-gray-500">
                                                No options available
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Selected Items Tags (for multi-select) */}
                            {isMulti && selectedOptions.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2 mt-1.5 w-full">
                                    {selectedOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            className="flex items-center bg-blue-50 text-sm text-blue-400 px-2 py-1 rounded-md">
                                            <span className="mr-1">
                                                {option.label}
                                            </span>
                                            <IoMdClose
                                                className="cursor-pointer"
                                                onClick={(e) =>
                                                    removeOption(option, e)
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Error Message */}
                            {(error || errorMessage) && (
                                <p className="text-red-700 text-sm mt-1">
                                    {error?.message?.toString() || errorMessage}
                                </p>
                            )}
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default CustomSearchSelect;
