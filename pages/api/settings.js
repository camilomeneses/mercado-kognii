import { mongooseConnect } from '@/lib/mongoose';
import { Setting } from '@/models/Setting';

export default async function handle(req, res) {
  try {
    await mongooseConnect();

    if (req.method === 'GET') {
      const { name } = req.query;

      if (name) {
        const data = await Setting.findOne({ name });
        res.json(data);
      } else {
        const data = await Setting.find({});
        res.json(data);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

