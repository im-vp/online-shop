import mongoose, { Model, Schema } from 'mongoose';

import { IReviews } from '@/types/types';

type IReviewsModel = IReviews & Document;

const ReviewsSchema = new Schema<IReviewsModel>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
      scale: 1,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ReviewsModel: Model<IReviewsModel> =
  mongoose.models.Reviews || mongoose.model<IReviewsModel>('Reviews', ReviewsSchema);

export default ReviewsModel;
