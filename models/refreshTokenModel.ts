import mongoose, { Model, Schema } from 'mongoose';

import { IRefreshToken } from '@/types/auth-types';

type IRefreshTokenModel = IRefreshToken & Document;

const RefreshTokenSchema = new Schema<IRefreshTokenModel>({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const RefreshTokenModel: Model<IRefreshTokenModel> =
  mongoose.models.RefreshToken ||
  mongoose.model<IRefreshTokenModel>('RefreshToken', RefreshTokenSchema);

export default RefreshTokenModel;
