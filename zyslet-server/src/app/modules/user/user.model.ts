import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { IUser, UserModel } from './user.interface';

const userSchema = new Schema<IUser, UserModel>(
   {
      name: {
         type: String,
         required: true,
      },
      role: {
         type: String,
         enum: ['admin'],
         required: true,
      },
      email: {
         type: String,
         unique: true,
         required: true,
      },
      password: {
         type: String,
         required: true,
         select: 0,
      },
      profile_image: {
         type: String,
         default: null,
      },
   },
   {
      timestamps: true,
      toJSON: {
         virtuals: true,
      },
   }
);

userSchema.pre('save', async function (next) {
   // eslint-disable-next-line @typescript-eslint/no-this-alias
   const user = this;
   user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
   );
   next();
});

export const User = model<IUser, UserModel>('User', userSchema);
