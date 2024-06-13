import { mongooseConnect } from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { Address } from '@/models/Address';

export default async function handle(req, res) {
  try {
    // TODO conexion a db
    await mongooseConnect();

    // TODO buscar en session del provider el user
    const { user } = await getServerSession(req, res, authOptions);

    if (req.method === 'GET') {
      // TODO consultar el address del user que hace la req
      const address = await Address.findOne({ userEmail: user.email });

      res.json(address);
    }

    // actualizar o crear address
    if (req.method === 'PUT') {
      // TODO consultar el address del user que hace la req
      const address = await Address.findOne({ userEmail: user.email });

      // si no se encuentra la info de address se crea para el user sino se actualiza
      if (address) {
        res.json(await Address.findByIdAndUpdate(address._id, req.body?.data));
      } else {
        res.json(
          await Address.create({ userEmail: user.email, ...req.body?.data })
        );
      }
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

