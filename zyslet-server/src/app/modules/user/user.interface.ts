import { Model } from 'mongoose';

export type IUser = {
   name: string;
   role: 'admin';
   email: string;
   password: string;
   profile_image?: string;
};

export type UserModel = Model<IUser, Record<string, unknown>>;
