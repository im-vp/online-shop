import mongoose, { Document, Model, Schema } from 'mongoose';

import { IOrder } from '@/types/types';

type OrderModel = IOrder & Document;

const OrderSchema = new Schema<OrderModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    guestName: {
      type: String,
      validator: function (this: IOrder, value: string) {
        return this.userId && value !== null;
      },
    },
    guestEmail: {
      type: String,
      validator: function (this: IOrder, value: string) {
        return this.userId && value !== null;
      },
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'completed'],
      default: 'pending',
    },
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  },
);

const OrderModel: Model<OrderModel> =
  mongoose.models.Order || mongoose.model<OrderModel>('Order', OrderSchema);

export default OrderModel;
