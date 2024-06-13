import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';

export default async function handle(req, res) {
  try {
    await mongooseConnect();
    const {
      categories,
      sort,
      currentPage,
      productsPerPage,
      phrase,
      ...filters
    } = req.query;

    const pageNumber = parseInt(currentPage) || 1;
    const productsLimit = parseInt(productsPerPage) || 8;

    let [sortField, sortOrder] = (sort || '_id-desc').split('-');

    const productsQuery = {};
    if (categories) {
      productsQuery.category = categories.split(',');
    }


    // TODO (search) busqueda por titulo o por descripcion
    if (phrase) {

      productsQuery['$or'] = [
        {
          title: { $regex: phrase, $options: 'i' },
        },
        {
          description: { $regex: phrase, $options: 'i' },
        },
      ]
    }

    // TODO (filters) Busqueda por medio de filtros dinamicos
    if (Object.keys(filters).length > 0) {
      Object.keys(filters).forEach((filterName) => {
        productsQuery['properties.' + filterName] = filters[filterName];
      });
    }

    const totalProducts = await Product.countDocuments(productsQuery);
    const totalPages = Math.ceil(totalProducts / productsLimit);

    const products = await Product.find(productsQuery, null, {
      sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 },
      skip: (pageNumber - 1) * productsLimit,
      limit: productsLimit,
    });

    res.json({
      currentPage: pageNumber,
      totalPages,
      products,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}






