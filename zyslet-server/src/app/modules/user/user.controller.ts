import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../../shared/catchAsync';
import { sendResponse } from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import { UserServices } from './user.services';

const createUser = catchAsync(async (req: Request, res: Response) => {
   const result = await UserServices.createUser(req.body);

   sendResponse<Partial<IUser>>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User Created successfully..!!',
      data: result,
   });
});
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
   const result = await UserServices.getAllUsers();

   sendResponse<IUser[]>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Users fetch successfully..!!',
      data: result,
   });
});
const userProfile = catchAsync(async (req: Request, res: Response) => {
   const result = await UserServices.userProfile(req.user?.email);

   sendResponse<IUser>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User profile fetch successfully..!!',
      data: result,
   });
});
const updateUser = catchAsync(async (req: Request, res: Response) => {
   const image = req.file;
   const result = await UserServices.updateUser(
      req.user?.email,
      req.body,
      image
   );

   sendResponse<IUser>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'User updated successfully..!!',
      data: result,
   });
});

export const UserController = {
   createUser,
   getAllUsers,
   userProfile,
   updateUser,
};
