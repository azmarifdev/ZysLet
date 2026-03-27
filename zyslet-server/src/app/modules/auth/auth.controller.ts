import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
   cookieConfig,
   cookieNames,
   getClearCookieOptions,
} from '../../../config/cookie';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { IRefreshToken } from './auth.interface';
import { AuthServices } from './auth.services';

const loginUser = catchAsync(async (req: Request, res: Response) => {
   const { ...loginData } = req.body;

   const result = await AuthServices.loginUser(loginData);

   // Set cookies using centralized configuration
   if (result?.refreshToken) {
      res.cookie(
         cookieNames.REFRESH_TOKEN,
         result.refreshToken,
         cookieConfig.refreshToken
      );
   }

   if (result?.accessToken) {
      res.cookie(
         cookieNames.ACCESS_TOKEN,
         result.accessToken,
         cookieConfig.accessToken
      );
   }

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User logged successfully..!!',
      data: result?.user,
   });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
   // Extract refresh token from cookies
   const refreshTokenFromCookie = req.cookies[cookieNames.REFRESH_TOKEN];

   if (!refreshTokenFromCookie) {
      return sendResponse(res, {
         statusCode: StatusCodes.UNAUTHORIZED,
         success: false,
         message: 'Refresh token is missing',
      });
   }

   const result = await AuthServices.refreshToken(refreshTokenFromCookie);

   // Clear the old cookies with proper options
   res.clearCookie(
      cookieNames.REFRESH_TOKEN,
      getClearCookieOptions(cookieConfig.refreshToken)
   );
   res.clearCookie(
      cookieNames.ACCESS_TOKEN,
      getClearCookieOptions(cookieConfig.accessToken)
   );

   // Set the new tokens
   res.cookie(
      cookieNames.REFRESH_TOKEN,
      result?.refreshToken,
      cookieConfig.refreshToken
   );

   res.cookie(
      cookieNames.ACCESS_TOKEN,
      result?.accessToken,
      cookieConfig.accessToken
   );

   sendResponse<IRefreshToken>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Token refreshed successfully..!!',
      data: result,
   });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
   const user = req.user;
   const { ...passwordData } = req.body;

   await AuthServices.changePassword(user, passwordData);

   sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Password changed successfully !',
   });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
   // Clear the cookies with proper options
   res.clearCookie(
      cookieNames.REFRESH_TOKEN,
      getClearCookieOptions(cookieConfig.refreshToken)
   );
   res.clearCookie(
      cookieNames.ACCESS_TOKEN,
      getClearCookieOptions(cookieConfig.accessToken)
   );

   sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User logged out successfully..!!',
   });
});

export const AuthController = {
   loginUser,
   refreshToken,
   changePassword,
   logoutUser,
};
