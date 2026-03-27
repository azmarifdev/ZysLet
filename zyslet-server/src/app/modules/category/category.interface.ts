import { Model } from 'mongoose';

export type ICategory = {
   title: string;
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;
