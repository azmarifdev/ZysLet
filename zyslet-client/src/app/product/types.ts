// Product Type
export type Product = {
    _id: string;
    id: string;
    title: string;
    slug: string;
    desc: string;
    thumbnail: string;
    images: ProductImage[];
    main_features: string;
    specification: ProductSpecification[];
    important_note: string;
    code: string;
    category: {
        _id: string;
        title: string;
    };
    discount: number;
    price: number;
    quantity: number;
    meta_desc: string;
    meta_keywords: string[];
    attributes: Attribute[];
    attribute?: Attribute | { title: string; value: string }[]; // Added to handle both formats
    is_published: boolean;
    is_free_shipping: boolean;
    show_related_products: boolean;
    youtube_video: string;
    createdAt: string;
    updatedAt: string;
    reviews: Review[];
    averageRating: number;
    relatedProducts: RelatedProduct[];
    description_blocks: DescriptionBlock[];
};
type DescriptionBlock = {
    _id: string;
    description: string;
    url: string;
    product_id: string;
    createdAt?: string; // This can be typed as a Date if you plan to work with actual Date objects
    updatedAt?: string; // This can be typed as a Date if you plan to work with actual Date objects
};
type Attribute = {
    title: string;
    values: string[];
    _id: string;
};

// Product Image Type
export type ProductImage = {
    _id: string;
    url: string;
};

// Product Specification Type
export type ProductSpecification = {
    _id: string;
    key: string;
    value: string;
};

// Review Type
export type Review = {
    name: string;
    message: string;
    rating: number;
    images: string[];
    createdAt: string;
};

// Related Product Type
export type RelatedProduct = {
    _id: string;
    title: string;
    slug: string;
    thumbnail: string;
    discount: number;
    price: number;
    id: string;
};
