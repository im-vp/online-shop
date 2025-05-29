import mongoose, { Model, Schema } from 'mongoose';

import { iFavorites } from '@/types/user-types';

type IFavoritesModel = iFavorites & Document;

const FavoritesSchema = new Schema<IFavoritesModel>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  favorites: {
    type: [String],
    default: [],
  },
});

const FavoritesModel: Model<IFavoritesModel> =
  mongoose.models.Favorites || mongoose.model<IFavoritesModel>('Favorites', FavoritesSchema);

export default FavoritesModel;
