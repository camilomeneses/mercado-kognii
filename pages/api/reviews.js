import { mongooseConnect } from '@/lib/mongoose';
import { Review } from '@/models/Review';

export default async function handle(req, res) {
  try {
    await mongooseConnect();
    if (req.method === 'POST') {
      const { title, description, stars, product, username, email } = req.body;
      res.json(
        await Review.create({
          title,
          description,
          stars,
          product,
          username,
          email,
        })
      );
    }

    if (req.method === 'GET') {
      const { product, page, limit } = req.query;
      const { email } = req.query;
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const skip = (pageNumber - 1) * limitNumber;

      const totalReviews = await Review.countDocuments({ product });
      const totalPages = Math.ceil(totalReviews / limitNumber);

      let reviews = await Review.find({ product })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber);
      // Verificar si se proporcionó un correo electrónico y si coincide con el de la sesión actual
      if (email && email !== '' && email !== 'undefined') {
        reviews = reviews.map((review, index) => {
          const reviewData = JSON.stringify(review);
          const dataParsed = JSON.parse(reviewData);
          return {
            ...review.toObject(),
            canDelete: dataParsed.email === email,
          };
        });
      } else {
        reviews = reviews.map((review) => ({
          ...review.toObject(),
          canDelete: false,
        }));
      }

      // Eliminar el campo 'email'
      reviews = reviews.map(({ email, ...review }) => review);

      res.json({ reviews, totalReviews, totalPages });
    }

    if (req.method === 'DELETE') {
      const { _id, email } = req.query;

      try {
        const review = await Review.findByIdAndRemove(_id);

        if (!review) {
          return res.status(404).json({ message: 'Review not found' });
        }

        if (review.email !== email) {
          return res.status(403).json({ message: 'Unauthorized' });
        }

        return res.json({ message: 'Review deleted successfully' });
      } catch (error) {
        console.error('Error deleting review:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

