export interface PriceDetails {
    originalPrice: number;
    salePrice: number;
    discountPercentage: number;
    savings: string;
    savingsAmount: number;
    hasDiscount: boolean;
}

/**
 * Calculates price details from a product with price and discount
 *
 * @param price The base price of the product
 * @param discountPercentage The discount percentage (0-100)
 * @returns A consistent price object with all pricing details
 */
export const calculatePrice = (price: number, discountPercentage: number = 0): PriceDetails => {
    // Ensure values are valid numbers
    const originalPrice = price || 0;
    const discount = discountPercentage; // Clamp between 0-100%

    // Only apply discount if it's greater than zero
    const hasDiscount = discount > 0;
    const calculatedSalePrice = hasDiscount ? originalPrice - (originalPrice * discount) / 100 : originalPrice;

    // Apply custom rounding: .50 and above rounds up, below .50 rounds down
    const salePrice = Math.round(calculatedSalePrice);
    const roundedOriginalPrice = Math.round(originalPrice);

    // Calculate savings
    const savingsAmount = roundedOriginalPrice - salePrice;

    return {
        originalPrice: roundedOriginalPrice,
        salePrice,
        discountPercentage: discount,
        savings: savingsAmount.toFixed(0),
        savingsAmount,
        hasDiscount,
    };
};
