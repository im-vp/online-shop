import mongoose, { Model, Schema } from 'mongoose';

import { IUser } from '@/types/user-types';

type UserModel = IUser & Document;

const UserSchema = new Schema<UserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    role: {
      type: String,
      default: 'user',
    },
    rating: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rating',
    },
    reviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reviews',
    },
    favorites: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Favorites',
    },
  },
  {
    timestamps: true,
  },
);

const UserModel: Model<UserModel> =
  mongoose.models.User || mongoose.model<UserModel>('User', UserSchema);

export default UserModel;
