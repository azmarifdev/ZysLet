import mongoose from 'mongoose';
import { IGenericErrorMessageType } from '../interface/IGenericErrorMessageType';
import { IGenericErrorResponse } from '../interface/IGenericErrorResponse';

export const handleValidationError = (
  error: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessageType[] = Object.values(error.errors).map(
    (element: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: element?.path,
        message: element?.message,
      };
    }
  );

  return {
    statusCode: 400,
    message: 'Validation Error',
    errorMessages: errors,
  };
};
