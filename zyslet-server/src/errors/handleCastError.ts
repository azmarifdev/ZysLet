import mongoose from 'mongoose';
import { IGenericErrorMessageType } from '../interface/IGenericErrorMessageType';

export const handleCastError = (error: mongoose.Error.CastError) => {
  //

  const errors: IGenericErrorMessageType[] = [
    {
      path: error.path,
      message: 'Invalid _id',
    },
  ];

  return {
    statusCode: 400,
    message: 'Cast Error',
    errorMessages: errors,
  };
};
