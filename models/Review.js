import { Product } from './Product';

const { Schema, models, model } = require('mongoose');

const ReviewSchema = new Schema(
  {
    title: String,
    description: String,
    stars: Number,
    product: { type: Schema.Types.ObjectId, ref: Product },
    username: String,
    email: String,
  },
  { timestamps: true }
);

export const Review = models?.Review || model('Review', ReviewSchema);

