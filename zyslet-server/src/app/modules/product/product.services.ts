/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { generateSlug } from '../../../helpers/generateSlug';
import { paginationHelper } from '../../../helpers/paginationCalculate';
import { IPaginationOptions } from '../../../interface/IPagination';
import { ImageUploadService } from '../../../shared/fileUpload';
import { Order } from '../order/order.model';
import { Review } from '../review/review.model';
import { IProduct, IProductSearchFilterableFields } from './product.interface';
import {
   DescriptionBlock,
   Product,
   ProductImage,
   Specification,
} from './product.model';

/* const createProduct = async (
   data: any,
   thumbnail: Express.Multer.File,
   productImages: Express.Multer.File[],
   descriptionBlocks: Array<{
      title: string;
      description: string;
      image: Express.Multer.File;
   }>
): Promise<IProduct> => {
   try {
      // ======================
      // STEP 1: UPLOAD ALL IMAGES FIRST
      // ======================
      const [
         uploadedThumbnail,
         uploadedProductImages,
         uploadedDescriptionBlockImages,
      ] = await Promise.all([
         ImageUploadService.uploadSingleFile(thumbnail, 'products'),
         ImageUploadService.uploadManyFile(productImages, 'products'),
         // Upload images from description blocks (if any)
         Promise.all(
            descriptionBlocks
               .filter(block => block.image)
               .map(block =>
                  ImageUploadService.uploadSingleFile(
                     block?.image,
                     'description-blocks'
                  )
               )
         ),
      ]);

      // ======================
      // STEP 2: PREPARE PRODUCT DATA
      // ======================

      // Handle attributes data if it exists
      let formattedAttributes: Array<{ title: string; values: string[] }> = [];
      if (data.attributes && Array.isArray(data.attributes)) {
         formattedAttributes = data.attributes
            .map((attr: any) => ({
               title: attr.title || '',
               values: Array.isArray(attr.values)
                  ? attr.values
                  : [attr.values].filter(Boolean),
            }))
            .filter((attr: any) => attr.title && attr.values.length > 0);
      }

      const productData = {
         title: data.title,
         code: data.code,
         category: data.category,
         price: Number(data.price) || 0,
         quantity: Number(data.quantity) || 0,
         is_published:
            data.is_published === 'true' || data.is_published === true,
         show_related_products:
            data.show_related_products === 'true' ||
            data.show_related_products === true,
         is_free_shipping:
            data.is_free_shipping === 'true' || data.is_free_shipping === true,
         discount: Number(data.discount) || 0,
         desc: data.desc,
         youtube_video: data.youtube_video,
         important_note: data.important_note,
         main_features: data.main_features,
         meta_keywords: data.meta_keywords,
         meta_desc: data.meta_desc,
         slug: generateSlug(data.title),
         thumbnail: uploadedThumbnail,
         attributes: formattedAttributes,
      };

      let formattedSpecs: Array<{ key: string; value: string }> = [];

      // Handle the specific format shown in your console output
      if (
         data.specifications &&
         data.specifications.key &&
         data.specifications.value
      ) {
         const keys = Array.isArray(data.specifications.key)
            ? data.specifications.key
            : [data.specifications.key];

         const values = Array.isArray(data.specifications.value)
            ? data.specifications.value
            : [data.specifications.value];

         formattedSpecs = keys
            .map((key: string, index: number) => ({
               key,
               value: values[index] || '',
            }))
            .filter((spec: any) => spec.key && spec.value);
      }

      // ======================
      // STEP 3: DATABASE OPERATIONS
      // ======================
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
         // Create Product
         const product = new Product(productData);
         await product.save({ session });

         // Handle Product Images
         if (uploadedProductImages.length > 0) {
            const productImageDocs = uploadedProductImages.map(url => ({
               product_id: product._id,
               url,
            }));
            const createdImages = await ProductImage.create(productImageDocs, {
               session,
            });
            product.images = createdImages.map(img => img._id) as any;

            await product.save({ session });
         }

         // Create specifications if they exist
         if (formattedSpecs.length > 0) {
            const specDocuments = formattedSpecs.map(spec => ({
               key: spec.key,
               value: spec.value,
               product_id: product._id,
            }));

            const createdSpecs = await Specification.create(specDocuments, {
               session,
            });

            // Use type assertion to fix the TypeScript error
            product.specification = createdSpecs.map(
               spec => spec._id
            ) as unknown as mongoose.Schema.Types.ObjectId[];
            await product.save({ session });
         }

         if (descriptionBlocks.length > 0) {
            const descriptionBlockDocs = descriptionBlocks.map(block => ({
               description: block?.description || '',
               url: block?.image
                  ? uploadedDescriptionBlockImages.shift()
                  : undefined,
               product_id: product._id,
            }));

            const createdDescriptionBlocks = await DescriptionBlock.create(
               descriptionBlockDocs,
               { session }
            );
            product.description_blocks = createdDescriptionBlocks.map(
               block => block._id
            ) as any;
            await product.save({ session });
         }

         if (data.bundle_products) {
            product.bundle_products = data.bundle_products;
            await product.save({ session });
         }

         await session.commitTransaction();
         return product;
      } catch (error) {
         await session.abortTransaction();
         throw error;
      } finally {
         session.endSession();
      }
   } catch (error: any) {
      console.error('Product creation failed:', error);
      throw new Error(`Failed to create product: ${error.message}`);
   }
}; */

const createProduct = async (
   data: any,
   thumbnail: Express.Multer.File,
   productImages: Express.Multer.File[],
   descriptionBlocks: Array<{
      title: string;
      description: string;
      image: Express.Multer.File;
   }>
): Promise<IProduct> => {
   try {
      // STEP 1: UPLOAD ALL IMAGES
      const [
         uploadedThumbnail,
         uploadedProductImages,
         uploadedDescriptionBlockImages,
      ] = await Promise.all([
         ImageUploadService.uploadSingleFile(thumbnail, 'products'),
         ImageUploadService.uploadManyFile(productImages, 'products'),
         Promise.all(
            descriptionBlocks
               .filter(block => block.image)
               .map(block =>
                  ImageUploadService.uploadSingleFile(
                     block?.image,
                     'description-blocks'
                  )
               )
         ),
      ]);

      // STEP 2: FORMAT ATTRIBUTES
      let formattedAttributes: Array<{ title: string; values: string[] }> = [];
      if (data.attributes && Array.isArray(data.attributes)) {
         formattedAttributes = data.attributes
            .map((attr: any) => ({
               title: attr.title || '',
               values: Array.isArray(attr.values)
                  ? attr.values
                  : [attr.values].filter(Boolean),
            }))
            .filter(attr => attr.title && attr.values.length > 0);
      }

      const productData = {
         title: data.title,
         code: data.code,
         category: data.category,
         price: Number(data.price) || 0,
         quantity: Number(data.quantity) || 0,
         is_published:
            data.is_published === 'true' || data.is_published === true,
         show_related_products:
            data.show_related_products === 'true' ||
            data.show_related_products === true,
         is_free_shipping:
            data.is_free_shipping === 'true' || data.is_free_shipping === true,
         discount: Number(data.discount) || 0,
         desc: data.desc,
         youtube_video: data.youtube_video,
         important_note: data.important_note,
         main_features: data.main_features,
         meta_keywords: data.meta_keywords,
         meta_desc: data.meta_desc,
         slug: generateSlug(data.title),
         thumbnail: uploadedThumbnail,
         attributes: formattedAttributes,
      };

      // STEP 3: FORMAT SPECIFICATIONS
      let formattedSpecs: Array<{ key: string; value: string }> = [];
      if (
         data.specifications &&
         data.specifications.key &&
         data.specifications.value
      ) {
         const keys = Array.isArray(data.specifications.key)
            ? data.specifications.key
            : [data.specifications.key];

         const values = Array.isArray(data.specifications.value)
            ? data.specifications.value
            : [data.specifications.value];

         formattedSpecs = keys
            .map((key: string, index: number) => ({
               key,
               value: values[index] || '',
            }))
            .filter(spec => spec.key && spec.value);
      }

      // STEP 4: CREATE PRODUCT
      const product = new Product(productData);
      await product.save();

      // STEP 5: CREATE PRODUCT IMAGES
      if (uploadedProductImages.length > 0) {
         const productImageDocs = uploadedProductImages.map(url => ({
            product_id: product._id,
            url,
         }));

         const createdImages = await ProductImage.create(productImageDocs);
         product.images = createdImages.map(img => img._id) as any;
         await product.save();
      }

      // STEP 6: CREATE SPECIFICATIONS
      if (formattedSpecs.length > 0) {
         const specDocs = formattedSpecs.map(spec => ({
            key: spec.key,
            value: spec.value,
            product_id: product._id,
         }));

         const createdSpecs = await Specification.create(specDocs);
         product.specification = createdSpecs.map(spec => spec._id) as any;
         await product.save();
      }

      // STEP 7: CREATE DESCRIPTION BLOCKS
      if (descriptionBlocks.length > 0) {
         const descriptionBlockDocs = descriptionBlocks.map(block => ({
            description: block.description || '',
            url: block.image
               ? uploadedDescriptionBlockImages.shift()
               : undefined,
            product_id: product._id,
         }));

         const createdDescriptionBlocks = await DescriptionBlock.create(
            descriptionBlockDocs
         );
         product.description_blocks = createdDescriptionBlocks.map(
            block => block._id
         ) as any;
         await product.save();
      }

      // STEP 8: HANDLE BUNDLE PRODUCTS
      if (data.bundle_products) {
         product.bundle_products = data.bundle_products;
         await product.save();
      }

      return product;
   } catch (error: any) {
      console.error('Product creation failed:', error);
      throw new Error(`Failed to create product: ${error.message}`);
   }
};

/// Service to get a product by ID
const getProduct = async (id: string) => {
   const product = await Product.findById(id)
      .populate({
         path: 'images',
         model: 'ProductImage',
         select: 'url',
      })
      .populate({
         path: 'specification',
         model: 'Specification',
         select: 'key value',
      })
      .populate({
         path: 'description_blocks',
         model: 'DescriptionBlock',
      })
      .populate({
         path: 'bundle_products',
         model: 'Product',
         select: 'title slug id thumbnail price discount',
      })
      .populate({
         path: 'category',
         model: 'Category',
         select: 'title',
      })
      .lean();

   if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');

   // Fetch reviews separately if not referenced in Product model
   const reviews = await Review.find({ product_id: id, is_published: true })
      .select('name message rating images createdAt')
      .sort({ createdAt: -1 })
      .lean();

   // Add reviews and calculate the average rating
   const productWithReviews = {
      ...product,
      reviews,
      averageRating:
         reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            : 0,
      relatedProducts: [] as Partial<IProduct[]>, // Explicitly define the type of relatedProducts
   };

   // Fetch related products if `show_related_products` is true
   if (product.show_related_products) {
      // Check if category is populated or just an ObjectId
      const categoryId =
         typeof product.category === 'object' && product.category !== null
            ? (product.category as any)._id
            : product.category;

      const relatedProducts = await Product.find({
         category: categoryId, // Get products from the same category
         _id: { $ne: id }, // Exclude the current product
      })
         .limit(20)
         .select('title slug thumbnail price discount')
         .lean(); // Get 20 products

      productWithReviews.relatedProducts = relatedProducts;
   }

   return productWithReviews;
};
const getProductBySlug = async (slug: string) => {
   const product = await Product.findOne({ slug, is_published: true })
      .populate({
         path: 'images',
         model: 'ProductImage',
         select: 'url',
      })
      .populate({
         path: 'specification',
         model: 'Specification',
         select: 'key value',
      })
      .populate({
         path: 'description_blocks',
         model: 'DescriptionBlock',
      })
      .populate({
         path: 'bundle_products',
         model: 'Product',
         select: 'title slug id thumbnail price discount',
      })
      .populate({
         path: 'category',
         model: 'Category',
         select: 'title',
      })
      .lean();

   if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
   const id = product._id;

   // Fetch reviews separately if not referenced in Product model
   const reviews = await Review.find({ product_id: id, is_published: true })
      .select('name message rating images createdAt')
      .sort({ createdAt: -1 })
      .lean();

   // Add reviews and calculate the average rating
   const productWithReviews = {
      ...product,
      reviews,
      averageRating:
         reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            : 0,
      relatedProducts: [] as Partial<IProduct[]>, // Explicitly define the type of relatedProducts
   };

   // Fetch related products if `show_related_products` is true
   if (product.show_related_products) {
      // Check if category is populated or just an ObjectId
      const categoryId =
         typeof product.category === 'object' && product.category !== null
            ? (product.category as any)._id
            : product.category;

      const relatedProducts = await Product.find({
         category: categoryId, // Get products from the same category
         _id: { $ne: id }, // Exclude the current product
      })
         .limit(20)
         .select('title slug thumbnail price discount')
         .lean(); // Get 20 products

      productWithReviews.relatedProducts = relatedProducts;
   }

   return productWithReviews;
};

// Get all products with properly implemented pagination, search, and filtering
const getAllProducts = async (
   filters: IProductSearchFilterableFields,
   paginationOptions: IPaginationOptions
) => {
   // Calculate pagination options using the helper
   const { page, limit, skip, sortBy, sortOrder } =
      paginationHelper.paginationCalculate(paginationOptions);
   // Prepare sort conditions
   const sortConditions: { [key: string]: SortOrder } = {};
   if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder;
   }

   // Prepare search and filter conditions
   const { search, ...filterData } = filters;
   const andConditions: any[] = [];

   // Search implementation - search across multiple fields
   if (search) {
      andConditions.push({
         $or: [
            {
               title: {
                  $regex: search,
                  $options: 'i',
               },
            },
         ],
      });
   }

   filterData.is_published = true;

   // Category filter
   if (filterData.category) {
      andConditions.push({
         category: filterData.category,
      });
   }

   // Published status filter
   if (filterData.is_published !== undefined) {
      andConditions.push({
         is_published: filterData.is_published,
      });
   }

   // Free shipping filter
   if (filterData.is_free_shipping !== undefined) {
      andConditions.push({
         is_free_shipping: filterData.is_free_shipping,
      });
   }

   // Price range filter
   if (
      filterData.min_price !== undefined ||
      filterData.max_price !== undefined
   ) {
      const priceCondition: { $gte?: number; $lte?: number } = {};

      if (filterData.min_price !== undefined)
         priceCondition.$gte = Number(filterData.min_price);

      if (filterData.max_price !== undefined)
         priceCondition.$lte = Number(filterData.max_price);

      andConditions.push({ price: priceCondition });
   }

   // Combine all conditions
   const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {};

   // Execute query with all filters and pagination
   const result = await Product.find(whereConditions)
      .populate({
         path: 'images',
         model: 'ProductImage',
         select: 'url',
      })
      .populate({
         path: 'specification',
         model: 'Specification',
         select: 'key value',
      })
      .populate({
         path: 'category',
         model: 'Category',
         select: 'title',
      })

      .sort(sortConditions)
      .skip(skip)
      .limit(limit)
      .lean();

   // Get total count for pagination metadata
   const total = await Product.countDocuments(whereConditions);

   // Return formatted response with pagination metadata
   return {
      meta: {
         page,
         limit,
         total,
      },
      data: result,
   };
};
const getAllProductsAdmin = async (
   filters: IProductSearchFilterableFields,
   paginationOptions: IPaginationOptions
) => {
   // Calculate pagination options using the helper
   const { page, limit, skip, sortBy, sortOrder } =
      paginationHelper.paginationCalculate(paginationOptions);
   // Prepare sort conditions
   const sortConditions: { [key: string]: SortOrder } = {};
   if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder;
   }

   // Prepare search and filter conditions
   const { search, ...filterData } = filters;
   const andConditions: any[] = [];

   // Search implementation - search across multiple fields
   if (search) {
      andConditions.push({
         $or: [
            {
               title: {
                  $regex: search,
                  $options: 'i',
               },
            },
            {
               code: {
                  $regex: search,
                  $options: 'i',
               },
            },
         ],
      });
   }

   // Category filter
   if (filterData.category) {
      andConditions.push({
         category: filterData.category,
      });
   }

   // Published status filter
   if (filterData.is_published !== undefined) {
      andConditions.push({
         is_published: filterData.is_published,
      });
   }

   // Free shipping filter
   if (filterData.is_free_shipping !== undefined) {
      andConditions.push({
         is_free_shipping: filterData.is_free_shipping,
      });
   }

   // Price range filter
   if (
      filterData.min_price !== undefined ||
      filterData.max_price !== undefined
   ) {
      const priceCondition: { $gte?: number; $lte?: number } = {};

      if (filterData.min_price !== undefined)
         priceCondition.$gte = Number(filterData.min_price);

      if (filterData.max_price !== undefined)
         priceCondition.$lte = Number(filterData.max_price);

      andConditions.push({ price: priceCondition });
   }

   // Combine all conditions
   const whereConditions =
      andConditions.length > 0 ? { $and: andConditions } : {};

   // Execute query with all filters and pagination
   const result = await Product.find(whereConditions)
      .populate({
         path: 'images',
         model: 'ProductImage',
         select: 'url',
      })
      .populate({
         path: 'specification',
         model: 'Specification',
         select: 'key value',
      })
      .populate({
         path: 'category',
         model: 'Category',
         select: 'title',
      })

      .sort(sortConditions)
      .skip(skip)
      .limit(limit)
      .lean();

   // Get total count for pagination metadata
   const total = await Product.countDocuments(whereConditions);

   // Return formatted response with pagination metadata
   return {
      meta: {
         page,
         limit,
         total,
      },
      data: result,
   };
};

const getBestSalesProducts = async () => {
   // Aggregate to find top selling products from completed orders
   const bestSellingProducts = await Order.aggregate([
      // Match only completed orders
      {
         $match: {
            status: { $in: ['pending', 'processing', 'completed'] },
         },
      },
      // Unwind the order_items array to work with individual items
      {
         $unwind: '$order_items',
      },
      // Lookup to join with OrderItem collection
      {
         $lookup: {
            from: 'orderitems',
            localField: 'order_items',
            foreignField: '_id',
            as: 'order_item_details',
         },
      },
      // Unwind the order_item_details array
      {
         $unwind: '$order_item_details',
      },
      // Group by product and sum quantities
      {
         $group: {
            _id: '$order_item_details.productId',
            totalQuantity: { $sum: '$order_item_details.quantity' },
            totalOrders: { $sum: 1 },
         },
      },
      // Sort by total quantity in descending order
      {
         $sort: { totalQuantity: -1 },
      },
      // Limit to top 20 products
      {
         $limit: 20,
      },
      // Lookup to get product details
      {
         $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product',
         },
      },
      // Unwind the product array
      {
         $unwind: '$product',
      },
      // Project to format the output
      {
         $project: {
            id: '$_id',
            title: '$product.title',
            thumbnail: '$product.thumbnail',
            price: '$product.price',
            discount: '$product.discount',
            is_free_shipping: '$product.is_free_shipping',
            slug: '$product.slug',
            totalQuantity: 1,
            totalOrders: 1,
            _id: 0,
         },
      },
   ]);

   return bestSellingProducts;
};

const togglePublishProduct = async (id: string): Promise<IProduct | null> => {
   const product = await Product.findById(id);
   if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
   }
   product.is_published = !product.is_published;
   await product.save();
   return product;
};

const updateProduct = async (data: any) => {
   const product = await Product.findById(data.id);

   if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
   }

   const { specification, ...updateData } = data;

   // Handle specification update
   if (specification) {
      // Delete the current specifications related to the product
      await Specification.deleteMany({
         product_id: data.id,
      });

      // Create new specifications if array is not empty
      if (Array.isArray(specification) && specification.length > 0) {
         const specifications = specification.map(spec => ({
            key: spec.key,
            value: spec.value,
            product_id: data.id,
         }));

         const createdSpecifications = await Specification.create(
            specifications
         );

         // Convert to ObjectId references
         updateData.specification = createdSpecifications.map(
            spec => spec._id
         ) as unknown as mongoose.Schema.Types.ObjectId[];
      } else {
         // If empty array, clear specifications
         updateData.specification = [];
      }
   }

   // Update slug if title changed
   if (updateData.title) updateData.slug = generateSlug(updateData.title);

   if (data.bundle_products) {
      product.bundle_products = data.bundle_products;
   }

   // Perform a single update operation
   const updatedProduct = await Product.findByIdAndUpdate(data.id, updateData, {
      new: true,
   }).populate('specification');

   return updatedProduct;
};

const updateThumbnail = async (
   thumbnail: Express.Multer.File,
   productId: string
): Promise<IProduct | null> => {
   const product = await Product.findById(productId);
   if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
   }

   // Delete the old thumbnail if it exists
   if (product.thumbnail) {
      await ImageUploadService.deleteSingleFile(product.thumbnail);
   }
   // Upload the new thumbnail
   const uploadedThumbnail = await ImageUploadService.uploadSingleFile(
      thumbnail,
      'products'
   );
   // Update the product with the new thumbnail URL
   product.thumbnail = uploadedThumbnail;
   await product.save();
   return product;
};

const updateProductImages = async (
   productId: string,
   images: Express.Multer.File[]
): Promise<IProduct | null> => {
   const product = await Product.findById(productId);
   if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
   }

   const imageUrls = await Promise.all(
      images.map(image =>
         ImageUploadService.uploadSingleFile(image, 'products')
      )
   );

   /// upload images model
   const imageDocuments = imageUrls.map(url => ({
      product_id: product._id,
      url,
   }));

   const createdImages = await ProductImage.insertMany(imageDocuments);

   // Push new image IDs to the existing product.images array
   if (product.images) {
      product.images.push(
         ...(createdImages.map(
            img => img._id
         ) as unknown as mongoose.Schema.Types.ObjectId[])
      );
   } else {
      product.images = createdImages.map(
         img => img._id
      ) as unknown as mongoose.Schema.Types.ObjectId[];
   }
   await product.save();

   return product.populate({
      path: 'images',
      model: 'ProductImage',
   });
};

const deleteProduct = async (id: string) => {
   const product = await Product.findById(id);
   if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
   }
   await Product.findByIdAndDelete(id);
};

const addDescriptionBlock = async (image: Express.Multer.File, data: any) => {
   const product = await Product.findById(data.product_id);
   if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
   }

   let imageUrl;

   if (image) {
      imageUrl = await ImageUploadService.uploadSingleFile(
         image,
         'description-blocks'
      );
   }

   const descriptionBlock = new DescriptionBlock({
      description: data.description || '',
      url: imageUrl || '',
      product_id: product._id,
   });

   await descriptionBlock.save();
   if (product.description_blocks) {
      product.description_blocks.push(descriptionBlock._id as any);
   } else {
      product.description_blocks = [descriptionBlock._id as any];
   }
   await product.save();

   return descriptionBlock;
};

const deleteDescriptionBlock = async (id: string) => {
   const descriptionBlock = await DescriptionBlock.findById(id);
   if (!descriptionBlock) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Description block not found');
   }
   await DescriptionBlock.findByIdAndDelete(id);
};

const updateDescriptionBlock = async (
   image: Express.Multer.File | undefined,
   imageUrl: string | undefined,
   data: any
) => {
   const descriptionBlock = await DescriptionBlock.findById(data.id);
   if (!descriptionBlock) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Description block not found');
   }

   let finalImageUrl = descriptionBlock.url;

   // If image is provided as a file (via multer upload)
   if (image) {
      finalImageUrl = await ImageUploadService.uploadSingleFile(
         image,
         'description-blocks'
      );

      // Delete the old image file
      await ImageUploadService.deleteSingleFile(descriptionBlock.url);
   } else if (imageUrl) {
      // If image URL is provided (it's a string)
      finalImageUrl = imageUrl;
   }

   descriptionBlock.description =
      data.description || descriptionBlock.description || '';
   descriptionBlock.url = finalImageUrl || '';

   await descriptionBlock.save();
   return descriptionBlock;
};

export const ProductServices = {
   createProduct,
   getProduct,
   getProductBySlug,
   getAllProductsAdmin,
   getAllProducts,
   togglePublishProduct,
   getBestSalesProducts,
   updateProduct,
   updateThumbnail,
   updateProductImages,
   deleteProduct,
   addDescriptionBlock,
   deleteDescriptionBlock,
   updateDescriptionBlock,
};
