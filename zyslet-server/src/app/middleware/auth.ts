import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import { cookieNames } from '../../config/cookie';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import { sendResponse } from '../../shared/sendResponse';

const auth =
   (...requiredRoles: string[]) =>
   async (req: Request, res: Response, next: NextFunction) => {
      try {
         // Get the access token from cookies or headers bearer token
         const token =
            req.cookies[cookieNames.ACCESS_TOKEN] ||
            req.headers?.authorization?.split(' ')[1];

         if (!token) {
            return sendResponse(res, {
               statusCode: StatusCodes.UNAUTHORIZED,
               success: false,
               message: 'Access token is missing',
            });
         }

         let verifiedUser;
         try {
            // Verify the access token
            verifiedUser = jwtHelpers.verifyToken(
               token,
               config.jwt.secret_token as Secret
            );
         } catch (error) {
            console.log(error);
            throw new ApiError(
               StatusCodes.UNAUTHORIZED,
               'You are not authorized'
            );
         }

         if (!verifiedUser) {
            throw new ApiError(
               StatusCodes.UNAUTHORIZED,
               'You are not authorized'
            );
         }

         req.user = verifiedUser;

         // Check if the user has one of the required roles
         if (
            requiredRoles.length &&
            !requiredRoles.includes(verifiedUser.role)
         ) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Forbidden');
         }

         next();
      } catch (error) {
         next(error);
      }
   };

export default auth;
