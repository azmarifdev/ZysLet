import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (
   payload: any,
   secret: Secret,
   expireTime: any
): string => {
   return jwt.sign(payload, secret, {
      expiresIn: expireTime,
   });
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
   return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
   createToken,
   verifyToken,
};
