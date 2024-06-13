import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';

export default async function handle(req, res) {
  try {
    await mongooseConnect();
    const ids = req.body.ids;
    res.json(await Product.find({ _id: ids }));
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
