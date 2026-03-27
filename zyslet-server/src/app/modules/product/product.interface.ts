import mongoose, { Model, Schema } from 'mongoose';

// Image Interface
export type IImage = {
   product_id: mongoose.Types.ObjectId;
   url: string;
};

export type IImageModel = Model<IImage, Record<string, unknown>>;

// Specification Interface
export type ISpecification = {
   key: string;
   value: string;
   product_id: mongoose.Types.ObjectId;
};

export type ISpecificationModel = Model<
   ISpecification,
   Record<string, unknown>
>;

export type IDescriptionBlock = {
   description?: string;
   url: string;
   product_id: mongoose.Types.ObjectId;
};

export type IAttribute = {
   title: string;
   values: string[];
};

export type IDescriptionBlockModel = Model<
   IDescriptionBlock,
   Record<string, unknown>
>;

// Product Interface with correct types for references
export type IProduct = {
   title: string;
   slug: string;
   desc?: string;
   thumbnail: string;
   images?: Schema.Types.ObjectId[]; // Change this to store ObjectIds
   main_features?: string;
   specification?: Schema.Types.ObjectId[]; // Change this to store ObjectIds
   description_blocks?: Schema.Types.ObjectId[]; // Change this to store ObjectIds
   important_note?: string;
   attributes?: IAttribute[];
   code: string;
   category: Schema.Types.ObjectId;
   discount?: number;
   price: number;
   quantity: number;
   meta_desc?: string;
   meta_keywords?: string[];
   is_published: boolean;
   is_free_shipping?: boolean;
   show_related_products?: boolean;
   youtube_video?: string;
   bundle_products?: Schema.Types.ObjectId[];
};
export type IProductModel = Model<IProduct, Record<string, unknown>>;

export type IProductSearchFilterableFields = {
   search?: string;
   code?: string;
   title?: string;
   desc?: string;
   main_features?: string;
   important_note?: string;
   attribute?: string;
   specification?: string;

   // added for filtering
   is_published?: boolean;
   category?: string;
   is_free_shipping?: boolean;
   min_price?: number;
   max_price?: number;
};

export const productSearchFilterFields = [
   'search',
   'code',
   'title',
   'desc',
   'main_features',
   'important_note',
   // added for filtering
   'category',
   'is_published',
   'is_free_shipping',
   'price',
   'min_price',
   'max_price',
];

export type IUpdateProduct = {
   id: string;
   title?: string;
   category?: Schema.Types.ObjectId;
   discount?: number;
   price: number;
   quantity?: number;
   desc?: string;
   main_features?: string;

   important_note?: string;
   attribute?: {
      title: string;
      values: string[];
   };

   specification?: [
      {
         key: string;
         value: string;
      }
   ];

   meta_desc?: string;
   meta_keywords?: string[];

   is_published: boolean;
   is_free_shipping?: boolean;
   show_related_products?: boolean;
   youtube_video?: string;
};
