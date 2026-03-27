import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
   env: process.env.NODE_ENV,
   port: process.env.PORT || 5000,
   database_url: process.env.DATABASE_URL,
   client_url: process.env.CLIENT_URL,
   admin_url: process.env.ADMIN_URL,
   api_url: process.env.API_URL,
   bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
   jwt: {
      secret_token: process.env.JWT_SECRET_TOKEN,
      secret_expires: process.env.JWT_EXPIRE_IN,
      refresh_token: process.env.JWT_REFRESH_TOKEN,
      refresh_expires: process.env.JWT_REFRESH_EXPIRE_IN,
   },
   local_file_url: process.env.LOCAL_FILE_URL,
   cloudinary: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
   },
   facebook: {
      access_token: process.env.FACEBOOK_ACCESS_TOKEN || '',
      pixel_id: process.env.FACEBOOK_PIXEL_ID || '',
      debug: process.env.NODE_ENV === 'development',
   },
};
