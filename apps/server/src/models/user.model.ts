import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Model, Schema, Types, model } from 'mongoose';
import { fileSchema } from './file.model';

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  avatar: string;
  password: string;
  displayName: string;
  banner: string | null;
  watchHistory: Types.ObjectId[];
  refreshToken: string;
}

interface IUserInstanceMethods {
  comparePasswords: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  generateResetPasswordToken: () => string;
}

type IUserModel = Model<IUser, object, IUserInstanceMethods>;

const userSchema = new Schema<IUser, IUserModel, IUserInstanceMethods>(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      index: true,
    },
    avatar: fileSchema,
    banner: fileSchema,
    password: {
      type: String,
      required: true,
      select: false,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

userSchema.methods.comparePasswords = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateResetPasswordToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.RESET_TOKEN_SECRET as string,
    {
      expiresIn: process.env.RESET_TOKEN_EXPIRY,
    }
  );
};

export const User = model('User', userSchema);
