import { randomBytes } from 'crypto';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import ApiError from '../errors/ApiError';

let cloudinaryConfigured = false;

const ensureCloudinaryConfig = () => {
   if (cloudinaryConfigured) return;

   if (
      !config.cloudinary.cloud_name ||
      !config.cloudinary.api_key ||
      !config.cloudinary.api_secret
   ) {
      throw new ApiError(
         StatusCodes.INTERNAL_SERVER_ERROR,
         'Cloudinary is not configured'
      );
   }

   cloudinary.config({
      cloud_name: config.cloudinary.cloud_name,
      api_key: config.cloudinary.api_key,
      api_secret: config.cloudinary.api_secret,
      secure: true,
   });

   cloudinaryConfigured = true;
};

const extractCloudinaryPublicId = (url: string): string | null => {
   try {
      const parsedUrl = new URL(url);
      if (!parsedUrl.hostname.includes('cloudinary.com')) return null;

      const uploadIndex = parsedUrl.pathname.indexOf('/upload/');
      if (uploadIndex === -1) return null;

      let publicIdWithExt = parsedUrl.pathname.substring(uploadIndex + 8);
      publicIdWithExt = publicIdWithExt.replace(/^v\d+\//, '');
      const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');

      return decodeURIComponent(publicId);
   } catch {
      return null;
   }
};

const uploadSingleFile = async (
   file: Express.Multer.File,
   folder: string
): Promise<string> => {
   if (!file) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'File data is missing');
   }

   ensureCloudinaryConfig();

   const sanitizedFilename = file.originalname
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w.-]/g, '');

   const filename = `${randomBytes(4).toString('hex')}-${sanitizedFilename}`;
   const publicId = filename.replace(/\.[^/.]+$/, '');

   return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
         {
            folder: `zyslet/${folder}`,
            public_id: publicId,
            resource_type: 'auto',
            use_filename: false,
            unique_filename: false,
            overwrite: false,
         },
         (error, result) => {
            if (error || !result?.secure_url) {
               return reject(
                  new ApiError(
                     StatusCodes.BAD_REQUEST,
                     `Failed to upload image: ${error?.message || 'unknown error'}`
                  )
               );
            }

            resolve(result.secure_url);
         }
      );
      uploadStream.end(file.buffer);
   });
};

const uploadManyFile = async (
   files: Express.Multer.File[],
   folder: string
): Promise<string[]> => {
   const uploadPromises = files.map(file => uploadSingleFile(file, folder));
   return await Promise.all(uploadPromises);
};

const deleteSingleFile = async (url: string): Promise<void> => {
   if (!url) return;

   const cloudinaryPublicId = extractCloudinaryPublicId(url);

   if (cloudinaryPublicId) {
      ensureCloudinaryConfig();
      await cloudinary.uploader.destroy(cloudinaryPublicId, {
         resource_type: 'image',
      });
      return;
   }

   try {
      const urlObj = new URL(url);
      const relativePath = urlObj.pathname.replace('/server-tmp/', '');
      const filePath = path.join('/tmp', relativePath);
      if (fs.existsSync(filePath)) {
         fs.unlinkSync(filePath);
      }
   } catch {
      // Ignore invalid URLs for backward compatibility
   }
};

const deleteManyFile = async (urls: string[]): Promise<void> => {
   await Promise.all(urls.map(url => deleteSingleFile(url)));
};

export const ImageUploadService = {
   uploadSingleFile,
   uploadManyFile,
   deleteSingleFile,
   deleteManyFile,
};
