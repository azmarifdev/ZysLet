import React, { useState, useEffect, useRef } from 'react';

interface ProductAttributesProps {
    attributeTitle?: string;
    attributeValues?: string[];
    // eslint-disable-next-line no-unused-vars
    onChange: (value: string) => void;
    selectedValue?: string; // Add this prop to accept a pre-selected value
}

const ProductAttributes: React.FC<ProductAttributesProps> = ({
    attributeTitle = '',
    attributeValues = [],
    onChange,
    selectedValue: externalSelectedValue, // Get the selected value from parent component
}) => {
    const [selectedValue, setSelectedValue] = useState<string>(externalSelectedValue || '');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Determine if this is a color attribute
    const isColorAttribute = attributeTitle.toLowerCase().includes('color');

    // Update internal state when external selected value changes
    useEffect(() => {
        if (externalSelectedValue) {
            setSelectedValue(externalSelectedValue);
        }
    }, [externalSelectedValue]);

    // Set the first value as default when component mounts or attributeValues change
    useEffect(() => {
        if (attributeValues.length > 0 && !selectedValue) {
            setSelectedValue(attributeValues?.[0]);
            onChange(attributeValues?.[0]);
        }
    }, [attributeValues, selectedValue, onChange]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // If there are no attribute values, don't render anything
    if (!attributeValues.length) {
        return null;
    }

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        onChange(value);
        setIsOpen(false);
    };

    // Helper function to get color class based on color name
    const getColorClass = (color: string): string => {
        const colorMap: Record<string, string> = {
            // Basic colors
            red: 'bg-red-500',
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            yellow: 'bg-yellow-400',
            black: 'bg-black',
            white: 'bg-white border-2 border-gray-300',
            purple: 'bg-purple-500',
            pink: 'bg-pink-500',
            orange: 'bg-orange-500',
            gray: 'bg-gray-500',
            brown: 'bg-amber-700',
            navy: 'bg-blue-900',
            silver: 'bg-gray-300',
            gold: 'bg-amber-400',

            // Reds
            crimson: 'bg-red-600',
            maroon: 'bg-red-800',
            scarlet: 'bg-red-700',
            wine: 'bg-red-900',
            ruby: 'bg-red-600',
            cherry: 'bg-red-600',
            coral: 'bg-orange-400',
            salmon: 'bg-orange-300',
            tomato: 'bg-red-500',
            burgundy: 'bg-red-900',

            // Blues
            'navy blue': 'bg-blue-900',
            'royal blue': 'bg-blue-700',
            'sky blue': 'bg-blue-300',
            teal: 'bg-teal-500',
            turquoise: 'bg-teal-400',
            cyan: 'bg-cyan-500',
            azure: 'bg-blue-200',
            cobalt: 'bg-blue-700',
            indigo: 'bg-indigo-500',
            'midnight blue': 'bg-blue-950',

            // Greens
            emerald: 'bg-emerald-500',
            'forest green': 'bg-green-800',
            lime: 'bg-lime-500',
            mint: 'bg-green-200',
            olive: 'bg-yellow-800',
            sage: 'bg-green-300',
            seafoam: 'bg-green-200',
            jade: 'bg-emerald-400',
            'hunter green': 'bg-green-900',
            moss: 'bg-green-700',

            // Yellows and Browns
            amber: 'bg-amber-500',
            beige: 'bg-yellow-100',
            khaki: 'bg-yellow-200',
            mustard: 'bg-yellow-600',
            tan: 'bg-yellow-200',
            caramel: 'bg-amber-600',
            cream: 'bg-yellow-50',
            bronze: 'bg-yellow-700',
            chocolate: 'bg-amber-800',
            coffee: 'bg-amber-900',

            // Purples and Pinks
            lavender: 'bg-purple-200',
            lilac: 'bg-purple-300',
            magenta: 'bg-fuchsia-600',
            mauve: 'bg-purple-300',
            plum: 'bg-purple-800',
            violet: 'bg-purple-600',
            fuchsia: 'bg-fuchsia-500',
            'hot pink': 'bg-pink-500',
            rose: 'bg-rose-400',
            orchid: 'bg-purple-400',

            // Neutrals and Others
            charcoal: 'bg-gray-700',
            slate: 'bg-slate-500',
            pewter: 'bg-gray-400',
            taupe: 'bg-stone-400',
            ivory: 'bg-stone-50 border-2 border-gray-200',
            pearl: 'bg-gray-100 border-2 border-gray-200',
            aqua: 'bg-cyan-400',
            copper: 'bg-orange-700',
            graphite: 'bg-gray-800',
            steel: 'bg-gray-500',
        };

        const lowerColor = color.toLowerCase();
        // Find the closest matching color
        for (const [key, value] of Object.entries(colorMap)) {
            if (lowerColor.includes(key)) {
                return value;
            }
        }

        // Default if no match
        return 'bg-gray-200';
    };

    return (
        <div className="p-2 bg-white border border-gray-200 rounded-lg relative" ref={dropdownRef}>
            <div className="mb-1">
                <h3 className="text-sm font-medium text-gray-700">{attributeTitle || 'Select Option'}</h3>
            </div>

            {/* Selected value display and dropdown trigger */}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all text-sm">
                    <div className="flex items-center gap-1.5">
                        {isColorAttribute && selectedValue && (
                            <span
                                className={`inline-block w-3 h-3 rounded-full ${getColorClass(selectedValue)}`}
                                aria-hidden="true"></span>
                        )}
                        <span className="truncate">{selectedValue}</span>
                    </div>
                    <svg
                        className={`w-3 h-3 ml-1 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Dropdown for attribute values */}
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full max-h-48 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-1.5">
                        {attributeValues.map((value, index) => (
                            <button
                                key={index}
                                onClick={() => handleSelect(value)}
                                className={`flex items-center w-full px-2.5 py-1.5 rounded-md text-left text-sm transition-all hover:bg-gray-50 ${
                                    selectedValue === value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                                }`}>
                                {isColorAttribute && (
                                    <span
                                        className={`inline-block w-3 h-3 rounded-full mr-1.5 ${getColorClass(value)}`}
                                        aria-hidden="true"></span>
                                )}
                                {value}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductAttributes;
