import { Product } from './Product';

const { Schema, models, model } = require('mongoose');

const WishProductSchema = new Schema({
  userEmail: { type: String, require: true },
  product: { type: Schema.Types.ObjectId, ref: Product },
});

export const WishedProduct =
  models?.WishedProduct || model('WishedProduct', WishProductSchema);

