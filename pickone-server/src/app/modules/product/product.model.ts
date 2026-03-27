import { model, Schema } from 'mongoose';
import {
   IDescriptionBlock,
   IDescriptionBlockModel,
   IImage,
   IImageModel,
   IProduct,
   IProductModel,
   ISpecification,
   ISpecificationModel,
} from './product.interface';

// Image Model
const productImageSchema = new Schema<IImage, IImageModel>(
   {
      product_id: {
         type: Schema.Types.ObjectId,
         ref: 'Product',
         required: true,
      },
      url: {
         type: String,
         required: true,
      },
   },
   {
      timestamps: true,
      toJSON: {
         virtuals: true,
      },
   }
);

// Specification Model
const specificationSchema = new Schema<ISpecification, ISpecificationModel>(
   {
      product_id: {
         type: Schema.Types.ObjectId,
         ref: 'Product',
         required: true,
      },
      key: {
         type: String,
         required: true,
      },
      value: {
         type: String,
         required: true,
      },
   },
   {
      timestamps: true,
      toJSON: {
         virtuals: true,
      },
   }
);

// Description Block Model
const descriptionBlockSchema = new Schema(
   {
      description: {
         type: String,
      },
      url: {
         type: String,
      },
      product_id: {
         type: Schema.Types.ObjectId,
         ref: 'Product',
         required: true,
      },
   },
   {
      timestamps: true,
      toJSON: {
         virtuals: true,
      },
   }
);

// Product Model
const productSchema = new Schema<IProduct, IProductModel>(
   {
      title: {
         type: String,
         required: true,
      },
      slug: {
         type: String,
         required: true,
      },
      desc: String,
      thumbnail: String,
      images: [
         {
            type: Schema.Types.ObjectId,
            ref: 'Image',
         },
      ],
      main_features: String,
      specification: [
         {
            type: Schema.Types.ObjectId,
            ref: 'Specification',
         },
      ],
      description_blocks: [
         {
            type: Schema.Types.ObjectId,
            ref: 'DescriptionBlock',
         },
      ],
      important_note: String,
      code: {
         type: String,
      },
      category: {
         type: Schema.Types.ObjectId,
         ref: 'Category',
         required: true,
      },
      discount: Number,
      price: {
         type: Number,
         required: true,
      },
      quantity: {
         type: Number,
         default: 0,
      },
      meta_desc: String,
      meta_keywords: [String],
      attributes: [
         {
            title: {
               type: String,
            },
            values: [
               {
                  type: String,
               },
            ],
         },
      ],
      is_published: {
         type: Boolean,
         default: false,
      },
      is_free_shipping: {
         type: Boolean,
         default: false,
      },
      show_related_products: {
         type: Boolean,
         default: false,
      },
      youtube_video: String,
      bundle_products: [
         {
            type: Schema.Types.ObjectId,
            ref: 'Product',
         },
      ],
   },
   {
      timestamps: true,
      toJSON: {
         virtuals: true,
      },
   }
);

// Query indexes for faster product list/detail endpoints
productSchema.index({ slug: 1 });
productSchema.index({ code: 1 });
productSchema.index({ category: 1, is_published: 1, createdAt: -1 });
productSchema.index({ is_published: 1, createdAt: -1 });

// Export all models
export const ProductImage = model<IImage, IImageModel>(
   'ProductImage',
   productImageSchema
);
export const DescriptionBlock = model<
   IDescriptionBlock,
   IDescriptionBlockModel
>('DescriptionBlock', descriptionBlockSchema);

export const Specification = model<ISpecification, ISpecificationModel>(
   'Specification',
   specificationSchema
);

export const Product = model<IProduct, IProductModel>('Product', productSchema);
