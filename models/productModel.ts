import mongoose, { Document, Model, Schema } from 'mongoose';

import { IProduct } from '@/types/types';

type ProductModel = IProduct & Document;

const ProductSchema = new Schema<ProductModel>(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categories',
      required: true,
    },
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
    path: {
      type: String,
      required: true,
      unique: true,
    },
    product_code: { type: String, required: true, unique: true },
    images: {
      type: [String],
      required: true,
    },
    description: String,
    price: { type: Number, required: true },
    rating: {
      value: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
        scale: 1,
        required: true,
      },
      reviewCount: {
        type: Number,
        default: 0,
        required: true,
      },
    },
    reviews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reviews',
    },
  },
  {
    timestamps: true,
  },
);

const ProductModel: Model<ProductModel> =
  mongoose.models.Product || mongoose.model<ProductModel>('Product', ProductSchema);

export default ProductModel;
