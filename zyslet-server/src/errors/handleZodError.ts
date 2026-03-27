import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorMessageType } from '../interface/IGenericErrorMessageType';

export const handleZodError = (error: ZodError) => {
  const errors: IGenericErrorMessageType[] = error?.issues?.map(
    (issue: ZodIssue) => {
      return {
        path: issue?.path[issue.path.length - 1],
        message: issue?.message,
      };
    }
  );

  return {
    statusCode: 400,
    message: 'Zod Validation Error',
    errorMessages: errors,
  };
};
