import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import config from '../../../config';
import { paginationFields } from '../../../constant/paginationOptions';
import ApiError from '../../../errors/ApiError';
import FacebookConversionApi from '../../../helpers/fbConversionApi';
import { catchAsync } from '../../../shared/catchAsync';
import { ImageUploadService } from '../../../shared/fileUpload';
import pick from '../../../shared/pick';
import { sendResponse } from '../../../shared/sendResponse';
import { productSearchFilterFields } from './product.interface';
import { ProductImage } from './product.model';
import { ProductServices } from './product.services';

const createProduct = catchAsync(async (req: Request, res: Response) => {
   const files = req.files as Express.Multer.File[];
   const body = req.body;

   // 1. Validate required images
   const thumbnail = files?.find(f => f.fieldname === 'thumbnail');
   const productImages = files?.filter(f => f.fieldname === 'images') || [];

   if (!thumbnail) throw new ApiError(400, 'Thumbnail is required');
   if (productImages.length < 1)
      throw new ApiError(400, 'At least 1 product image is required');

   let descriptionBlocks = [];
   if (body.description_blocks && Array.isArray(body.description_blocks)) {
      descriptionBlocks = body.description_blocks.map(
         (block: { description: string }, index: number) => ({
            description: block?.description,
            image: files?.find(
               f => f.fieldname === `description_blocks[${index}][image]`
            ),
         })
      );
   }

   // 2. Proceed with product creation
   const result = await ProductServices.createProduct(
      req.body,
      thumbnail,
      productImages,
      descriptionBlocks
   );

   sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Product created successfully',
      data: result,
   });
});

const getProduct = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await ProductServices.getProduct(id);

   // Track product view event for Facebook Conversion API
   try {
      const sourceUrl =
         req.get('Referer') ||
         `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      const conversionApi = new FacebookConversionApi({
         access_token: config.facebook.access_token,
         pixel_id: config.facebook.pixel_id,
         clientIpAddress: req.ip || req.connection.remoteAddress || '',
         clientUserAgent: req.headers['user-agent'] || '',
         fbp: req.cookies?._fbp || null,
         fbc: req.cookies?._fbc || null,
         debug: config.facebook.debug,
      });

      // Send ViewContent event asynchronously
      conversionApi.trackProductView(
         result.code || result._id.toString(),
         result.price,
         sourceUrl,
         { eventId: `pv_${result._id.toString()}_${Date.now()}` }
      );
   } catch (error) {
      // Don't let tracking errors affect the API response
      console.error('Facebook Conversion API error:', error);
   }

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Product retrieved successfully',
      data: result,
   });
});

const getProductBySlug = catchAsync(async (req: Request, res: Response) => {
   const { slug } = req.params;
   const result = await ProductServices.getProductBySlug(slug);

   // Track product view event for Facebook Conversion API
   try {
      const sourceUrl =
         req.get('Referer') ||
         `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      const conversionApi = new FacebookConversionApi({
         access_token: config.facebook.access_token,
         pixel_id: config.facebook.pixel_id,
         clientIpAddress: req.ip || req.connection.remoteAddress || '',
         clientUserAgent: req.headers['user-agent'] || '',
         fbp: req.cookies?._fbp || null,
         fbc: req.cookies?._fbc || null,
         debug: config.facebook.debug,
      });

      // Send ViewContent event asynchronously
      conversionApi.trackProductView(
         result.code || result._id.toString(),
         result.price,
         sourceUrl,
         { eventId: `pv_${result._id.toString()}_${Date.now()}` }
      );
   } catch (error) {
      // Don't let tracking errors affect the API response
      console.error('Facebook Conversion API error:', error);
   }

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Product retrieved successfully',
      data: result,
   });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
   // Extract search and filter parameters from query
   const filters = pick(req.query, productSearchFilterFields);

   // Extract pagination parameters
   const paginationOptions = pick(req.query, paginationFields);

   if (filters.is_published !== undefined) {
      filters.is_published = (filters.is_published === 'true') as unknown as
         | string
         | undefined;
   }

   if (filters.is_free_shipping !== undefined) {
      filters.is_free_shipping = (filters.is_free_shipping ===
         'true') as unknown as string | undefined;
   }
   console.log('filters: ', filters);

   // Get products with filtering and pagination
   const result = await ProductServices.getAllProducts(
      filters,
      paginationOptions
   );

   // Track search and filter events for Facebook Conversion API
   try {
      if (
         filters.searchTerm ||
         filters.category ||
         filters.tag ||
         filters.price ||
         filters.is_free_shipping
      ) {
         const sourceUrl =
            req.get('Referer') ||
            `${req.protocol}://${req.get('host')}${req.originalUrl}`;
         const conversionApi = new FacebookConversionApi({
            access_token: config.facebook.access_token,
            pixel_id: config.facebook.pixel_id,
            clientIpAddress: req.ip || req.connection.remoteAddress || '',
            clientUserAgent: req.headers['user-agent'] || '',
            fbp: req.cookies?._fbp || null,
            fbc: req.cookies?._fbc || null,
            debug: config.facebook.debug,
         });

         // If there's a search term, track search event
         if (filters.searchTerm) {
            conversionApi.trackSearch(filters.searchTerm as string, sourceUrl, {
               eventId: `search_${Date.now()}`,
            });
         }

         // If there are filters, track filter event
         if (
            filters.category ||
            filters.tag ||
            filters.price ||
            filters.is_free_shipping
         ) {
            conversionApi.trackFilter(filters, sourceUrl, {
               eventId: `filter_${Date.now()}`,
            });
         }
      }
   } catch (error) {
      // Don't let tracking errors affect the API response
      console.error('Facebook Conversion API error:', error);
   }

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Products retrieved successfully',
      meta: result.meta,
      data: result.data,
   });
});
const getAllProductsAdmin = catchAsync(async (req: Request, res: Response) => {
   // Extract search and filter parameters from query
   const filters = pick(req.query, productSearchFilterFields);

   // Extract pagination parameters
   const paginationOptions = pick(req.query, paginationFields);

   if (filters.is_published !== undefined) {
      filters.is_published = (filters.is_published === 'true') as unknown as
         | string
         | undefined;
   }

   if (filters.is_free_shipping !== undefined) {
      filters.is_free_shipping = (filters.is_free_shipping ===
         'true') as unknown as string | undefined;
   }
   console.log('filters: ', filters);

   // Get products with filtering and pagination
   const result = await ProductServices.getAllProductsAdmin(
      filters,
      paginationOptions
   );

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Products retrieved successfully',
      meta: result.meta,
      data: result.data,
   });
});

const getBestSalesProducts = catchAsync(async (req: Request, res: Response) => {
   const result = await ProductServices.getBestSalesProducts();

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Best sales products retrieved successfully',
      data: result,
   });
});

const togglePublishProduct = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await ProductServices.togglePublishProduct(id);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Product publish status toggled successfully',
      data: result,
   });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
   // Call the service to handle image upload and product update
   const result = await ProductServices.updateProduct(req.body);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Product updated successfully',
      data: result,
   });
});

const updateThumbnail = catchAsync(async (req: Request, res: Response) => {
   const thumbnail = req.file;

   if (!thumbnail) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Thumbnail image is missing');
   }

   const result = await ProductServices.updateThumbnail(
      thumbnail,
      req.params.id
   );

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Thumbnail updated successfully',
      data: result,
   });
});

const updateProductImages = catchAsync(async (req: Request, res: Response) => {
   const files = req.files as { [fieldname: string]: Express.Multer.File[] };
   const productImages = files['images'];
   if (!productImages || productImages.length < 1) {
      throw new ApiError(
         StatusCodes.BAD_REQUEST,
         'At least one product image is required'
      );
   }
   const result = await ProductServices.updateProductImages(
      req.params.id,
      productImages
   );
   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Product images updated successfully',
      data: result,
   });
});

const removeProductImage = catchAsync(async (req: Request, res: Response) => {
   const imageId = req.params.id;

   if (!imageId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Image ID is required');
   }

   const result = await ProductImage.findByIdAndDelete(imageId);
   if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Image not found');
   }
   // Optionally, you can also remove the image from the file system if needed
   await ImageUploadService.deleteSingleFile(result.url);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Product image removed successfully',
      data: result,
   });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
   const { id } = req.params;
   const result = await ProductServices.deleteProduct(id);
   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Product deleted successfully',
      data: result,
   });
});

const addDescriptionBlock = catchAsync(async (req: Request, res: Response) => {
   const image = req.file;

   const result = await ProductServices.addDescriptionBlock(image, req.body);

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Description block added successfully',
      data: result,
   });
});

const updateDescriptionBlock = catchAsync(
   async (req: Request, res: Response) => {
      const image = req.file; // This is the file from the form data (if uploaded)
      const imageUrl = req.body.image; // This is the string URL (if provided in the form)

      // Pass image and imageUrl to the service for handling
      const result = await ProductServices.updateDescriptionBlock(
         image,
         imageUrl,
         req.body
      );

      sendResponse(res, {
         statusCode: StatusCodes.OK,
         success: true,
         message: 'Description block updated successfully',
         data: result,
      });
   }
);

const deleteDescriptionBlock = catchAsync(
   async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await ProductServices.deleteDescriptionBlock(id);
      sendResponse(res, {
         statusCode: StatusCodes.OK,
         success: true,
         message: 'Description block deleted successfully',
         data: result,
      });
   }
);

export const ProductController = {
   createProduct,
   getProduct,
   getAllProducts,
   togglePublishProduct,
   getBestSalesProducts,
   updateProduct,
   updateThumbnail,
   updateProductImages,
   removeProductImage,
   getAllProductsAdmin,
   getProductBySlug,
   deleteProduct,
   addDescriptionBlock,
   updateDescriptionBlock,
   deleteDescriptionBlock,
};
