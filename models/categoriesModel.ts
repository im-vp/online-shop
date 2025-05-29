import mongoose, { Model, Schema } from 'mongoose';

import { ICategories } from '@/types/types';

type CategoriesModel = ICategories & Document;

const CategoriesSchema = new Schema<CategoriesModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    display: {
      type: Boolean,
      default: false,
    }
  },

  {
    timestamps: true,
  },
);

const CategoriesModel: Model<CategoriesModel> =
  mongoose.models.Categories || mongoose.model<CategoriesModel>('Categories', CategoriesSchema);

export default CategoriesModel;
