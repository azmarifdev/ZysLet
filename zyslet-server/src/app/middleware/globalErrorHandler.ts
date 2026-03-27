/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { handleCastError } from '../../errors/handleCastError';
import { handleValidationError } from '../../errors/handleValidationError';
import { handleZodError } from '../../errors/handleZodError';
import { IGenericErrorMessageType } from '../../interface/IGenericErrorMessageType';
// import { errorlogger } from '../../shared/logger';

export const globalErrorHandler: ErrorRequestHandler = (
   error,
   req,
   res,
   next
) => {
   // //
   // config.env === 'development'
   //    ? console.log('Global error handler -->', error)
   //    : errorlogger.error('Global error handler ', error);

   console.log('Global error handler -->', error);

   let statusCode = 500;
   let message = 'Something went worng.';
   let errorMessage: IGenericErrorMessageType[] = [];
   // vaditaon error
   if (error?.name === 'ValidationError') {
      const simplyfiedError = handleValidationError(error);
      (statusCode = simplyfiedError.statusCode),
         (message = simplyfiedError.message),
         (errorMessage = simplyfiedError.errorMessages);

      // ZodError
   } else if (error instanceof ZodError) {
      const simplyfiedError = handleZodError(error);
      (statusCode = simplyfiedError.statusCode),
         (message = simplyfiedError.message),
         (errorMessage = simplyfiedError.errorMessages);

      // ApiError
   } else if (error instanceof ApiError) {
      statusCode = error?.statusCode;
      message = error.message;
      errorMessage = error?.message
         ? [
              {
                 path: 'ApiError',
                 message: error?.message,
              },
           ]
         : [];

      // Cast Error
   } else if (error?.name === 'CastError') {
      const simplifiedError = handleCastError(error);
      statusCode = simplifiedError.statusCode;
      message = simplifiedError.message;
      errorMessage = simplifiedError.errorMessages;
   } else if (error instanceof Error) {
      message = error?.message;
      errorMessage = error?.message
         ? [
              {
                 path: 'Error',
                 message: error?.message,
              },
           ]
         : [];
   }
   res.status(statusCode).json({
      status: false,
      message,
      errorMessage,
      stack: config.env !== 'production' ? error?.stack : message,
   });
};
