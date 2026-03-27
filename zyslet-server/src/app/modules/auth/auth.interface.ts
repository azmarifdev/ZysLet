import { IUser } from '../user/user.interface';

export type ILoginUser = {
   email: string;
   password: string;
};
export type ILoginResponse = {
   accessToken: string;
   refreshToken?: string;
   user: IUser;
};
export type IRefreshToken = {
   accessToken: string;
   refreshToken?: string;
};

export type IChangePassword = {
   oldPassword: string;
   newPassword: string;
};
