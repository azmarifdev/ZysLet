import React from 'react';
import ProductAttributes from './ProductAttributes';

// Define a structure for multiple attributes
export interface Attribute {
    title: string;
    values: string[];
}

interface MultipleAttributesSelectorProps {
    attributes: Attribute[];
    // eslint-disable-next-line no-unused-vars
    onAttributeChange: (attributeTitle: string, value: string) => void;
    selectedAttributes: Record<string, string>;
}

const MultipleAttributesSelector: React.FC<MultipleAttributesSelectorProps> = ({
    attributes,
    onAttributeChange,
    selectedAttributes,
}) => {
    if (!attributes || attributes.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-row flex-wrap gap-2">
            {attributes.map((attribute, index) => (
                <div key={`${attribute.title}-${index}`} className="flex-1 min-w-[120px] max-w-full attribute-item">
                    <ProductAttributes
                        attributeTitle={attribute.title}
                        attributeValues={attribute.values}
                        onChange={(value) => onAttributeChange(attribute.title, value)}
                        selectedValue={selectedAttributes[attribute.title] || ''}
                    />
                </div>
            ))}
        </div>
    );
};

export default MultipleAttributesSelector;
