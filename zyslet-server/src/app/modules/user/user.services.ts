import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ImageUploadService } from '../../../shared/fileUpload';
import { IUser } from './user.interface';
import { User } from './user.model';
const createUser = async (payload: IUser): Promise<Partial<IUser> | null> => {
   payload.role = 'admin';
   const user = await User.create(payload);
   if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
   }
   return null;
};
const getAllUsers = async (): Promise<IUser[] | null> => {
   return await User.find().select('-password');
};

const userProfile = async (email: string): Promise<IUser | null> => {
   return await User.findOne({ email }).select('-password');
};

const updateUser = async (
   email: string,
   payload: IUser,
   image: Express.Multer.File | undefined
): Promise<IUser | null> => {
   console.log('updateUser called with:', {
      email,
      payload,
      hasImage: !!image,
   });

   const isUserExist = await User.findOne({ email });

   if (!isUserExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
   }

   const { ...userData } = payload;

   // Handle image upload
   if (image) {
      try {
         const uploadImage = await ImageUploadService.uploadSingleFile(
            image,
            'user'
         );
         userData.profile_image = uploadImage;

         // Delete old image if exists
         if (isUserExist.profile_image) {
            await ImageUploadService.deleteSingleFile(
               isUserExist.profile_image
            );
         }
      } catch (error) {
         console.error('Image upload error:', error);
         throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to upload image');
      }
   }

   // If updating email, check if it's different and not already taken
   if (userData.email && userData.email !== email) {
      const emailExists = await User.findOne({ email: userData.email });
      if (emailExists) {
         throw new ApiError(StatusCodes.CONFLICT, 'Email already exists');
      }
   }

   const formattedUserData = {
      name: userData.name || isUserExist.name,
      email: userData.email || isUserExist.email,
      profile_image: userData.profile_image || isUserExist.profile_image,
   };

   console.log('Updating user with data:', formattedUserData);

   const updatedUser = await User.findOneAndUpdate(
      { email },
      formattedUserData,
      {
         new: true,
      }
   ).select('-password');

   console.log('User updated successfully:', updatedUser);
   return updatedUser;
};

export const UserServices = {
   createUser,
   getAllUsers,
   userProfile,
   updateUser,
};
