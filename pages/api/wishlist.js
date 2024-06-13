import { mongooseConnect } from '@/lib/mongoose';
import { WishedProduct } from '@/models/WishedProduct';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

export default async function handle(req, res) {
  try {
    // TODO conectar a la database
    await mongooseConnect();

    // TODO buscar en session del provider el user
    const { user } = await getServerSession(req, res, authOptions);

    // TODOcomprobar en el metodo post acciones
    if (req.method === 'POST') {
      const { product } = req.body;
      // buscando en database que los datos coincidad email, product
      const wishedDoc = await WishedProduct.findOne({
        userEmail: user?.email,
        product,
      });

      // comprobar si existe ese doc borrarlo, sino crearlo
      if (wishedDoc) {
        await WishedProduct.findByIdAndDelete(wishedDoc._id);
        res.json('deleted');
      } else {
        await WishedProduct.create({ userEmail: user?.email, product });
        res.json('created');
      }
    }

    // llevar todos los products del wishlist segun el email
    if (req.method === 'GET') {
      res.json(
        await WishedProduct.find({ userEmail: user?.email }).populate('product')
      );
    }

    // Obtener la cantidad de wishedProducts
    if (req.method === 'GET' && req.query.count === 'true') {
      const count = await WishedProduct.countDocuments({
        userEmail: user?.email,
      });
      res.json({ count });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


