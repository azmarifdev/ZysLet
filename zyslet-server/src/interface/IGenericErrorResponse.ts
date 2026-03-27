import { IGenericErrorMessageType } from './IGenericErrorMessageType';

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessageType[];
};
