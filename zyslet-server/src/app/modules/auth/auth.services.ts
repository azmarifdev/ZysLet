import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { User } from '../user/user.model';
import {
   IChangePassword,
   ILoginResponse,
   ILoginUser,
   IRefreshToken,
} from './auth.interface';

const loginUser = async (
   payload: ILoginUser
): Promise<ILoginResponse | null> => {
   const { email, password } = payload;

   const isUserExist = await User.findOne({ email }).select(
      'password role name email profile_image createdAt id'
   );
   console.log('isUserExist: ', isUserExist);

   if (!isUserExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User does not exist');
   }

   const isPasswordMatched = await bcrypt.compare(
      password,
      isUserExist.password
   );

   if (!isPasswordMatched) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Password is incorrect');
   }

   // create access token
   const accessToken = jwtHelpers.createToken(
      { email, role: isUserExist?.role },
      config.jwt.secret_token as Secret,
      config.jwt.secret_expires as string
   );

   const refreshToken = jwtHelpers.createToken(
      { email, role: isUserExist?.role },
      config.jwt.refresh_token as Secret,
      config.jwt.refresh_expires as string
   );

   return {
      refreshToken,
      accessToken,
      user: isUserExist,
   };
};

const refreshToken = async (token: string): Promise<IRefreshToken | null> => {
   let verifiedToken = null as unknown as JwtPayload;
   try {
      verifiedToken = jwtHelpers.verifyToken(
         token,
         config.jwt.refresh_token as Secret
      );
   } catch (err) {
      console.log(err);
      throw new ApiError(StatusCodes.FORBIDDEN, 'Invalid Refresh Token');
   }

   const { email } = verifiedToken;

   // tumi delete hye gso  kintu tumar refresh token ase
   // checking deleted user's refresh token

   const isUserExist = await User.findOne({ email }, { role: 1 });
   if (!isUserExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User does not exist');
   }

   //generate new token

   const newAccessToken = jwtHelpers.createToken(
      { email, role: isUserExist.role },
      config.jwt.secret_token as Secret,
      config.jwt.secret_expires as string
   );

   const refreshToken = jwtHelpers.createToken(
      { email, role: isUserExist?.role },
      config.jwt.refresh_token as Secret,
      config.jwt.refresh_expires as string
   );

   return {
      accessToken: newAccessToken,
      refreshToken,
   };
};

const changePassword = async (
   user: JwtPayload | null,
   payload: IChangePassword
): Promise<void> => {
   const { oldPassword, newPassword } = payload;

   // // checking is user exist
   const isUserExist = await User.findOne(
      { email: user?.email },
      { password: 1, role: 1 }
   );

   if (!isUserExist) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User does not exist');
   }

   // checking old password
   const isPasswordMatched = await bcrypt.compare(
      oldPassword,
      isUserExist.password
   );

   if (!isPasswordMatched) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, 'Old password is incorrect');
   }

   // hash password before saving
   const newHashedPassword = await bcrypt.hash(
      newPassword,
      Number(config.bcrypt_salt_rounds)
   );

   const query = { email: user?.email };

   await User.findOneAndUpdate(query, {
      password: newHashedPassword,
   });
};

export const AuthServices = {
   loginUser,
   refreshToken,
   changePassword,
};
