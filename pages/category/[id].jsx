import Center from '@/components/Center';
import Header from '@/components/Header';
import ProductsGrid from '@/components/ProductsGrid';
import Spinner from '@/components/Spinner';
import Title from '@/components/Title';
import { Category } from '@/models/Category';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getServerSession } from 'next-auth';
import { WishedProduct } from '@/models/WishedProduct';
import { authOptions } from '../api/auth/[...nextauth]';
import { InfoIcon } from '@/components/icons';
import Footer from '@/components/Footer';
import axios from 'axios';
import { Product } from '@/models/Product';
import PaginationGrid from '@/components/PaginationGrid';

const CategoryTitle = styled(Title)`
  margin-top: 40px;
`;

const Filter = styled.div`
  display: flex;
  padding: 15px 20px;
  gap: 10px;

  @media screen and (min-width: 370px) {
    padding: 15px 20px;
  }

  select {
    background-color: transparent;
    border: 0;
    font-size: inherit;
  }
`;

const FiltersTitle = styled.div`
  padding-left: 5px;
  font-size: 0.9rem;
  color: #222;
`;

const FiltersWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-flow: row;
  background-color: #e6e6e6a2;
  margin: 5px 0 15px;
  padding: 5px 0;
  border-radius: 10px;

  @media screen and (min-width: 420px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (min-width: 540px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const PropTitle = styled.div`
  text-transform: capitalize;
`;

const WhiteBoxNotFound = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 10px;
  -webkit-box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);
  -moz-box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);
  box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);
`;

const Bg = styled.div`
  background-image: url('/cart-bg.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 80vh;
  padding: 40px 0;
`;

const IconWrapper = styled.div`
  width: 2rem;
  height: 2rem;
`;

const NoProductsWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: last center;
`;

export default function CategoryPage({
  category,
  subCategories,
  wishedProducts = [],
}) {
  const defaultSorting = '_id-desc';
  const defaultFilterValues = category.properties.map((propertie) => ({
    name: propertie.name,
    value: 'all',
  }));

  const [products, setProducts] = useState([]);
  const [filtersValues, setFiltersValues] = useState(defaultFilterValues);
  const [sort, setSort] = useState(defaultSorting);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [filtersChanged, setFiltersChanged] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 8;

  function onFilterChange(filterName, filterValue) {
    setFiltersValues((prev) => {
      return prev.map((prop) => ({
        name: prop.name,
        value: prop.name === filterName ? filterValue : prop.value,
      }));
    });
    setFiltersChanged(true);
  }

  useEffect(() => {
    setLoadingProducts(true);

    const catIds = [
      category._id,
      ...(subCategories?.map((category) => category._id) || []),
    ];

    const params = new URLSearchParams();
    params.set('categories', catIds.join(','));
    params.set('sort', sort);
    params.set('currentPage', currentPage.toString());
    params.set('productsPerPage', productsPerPage.toString());

    filtersValues.forEach((filter) => {
      if (filter.value !== 'all') {
        params.set(filter.name, filter.value);
      }
    });

    const url = `/api/products?${params.toString()}`;
    axios
      .get(url)
      .then((res) => {
        const { currentPage, totalPages, products } = res.data;
        setCurrentPage(currentPage);
        setTotalPages(totalPages);
        setProducts(products);
        setLoadingProducts(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoadingProducts(false);
      });
  }, [category, subCategories, filtersValues, sort, currentPage]);

  function handlePrevPage() {
    setCurrentPage((prevPage) => prevPage - 1);
  }

  function handleNextPage() {
    setCurrentPage((prevPage) => prevPage + 1);
  }

  function setCurrentPageGrid(page) {
    setCurrentPage(page);
  }

  return (
    <>
      <Header />
      <Bg>
        <Center>
          <CategoryTitle>{category.name}</CategoryTitle>
          {category.properties?.length > 0 && (
            <>
              <FiltersTitle>Filters</FiltersTitle>
              <FiltersWrapper>
                {category.properties?.map((propertie) => (
                  <Filter key={propertie.name}>
                    <PropTitle>{propertie.name}</PropTitle>:
                    <select
                      onChange={(ev) =>
                        onFilterChange(propertie.name, ev.target.value)
                      }
                      value={
                        filtersValues.find(
                          (filter) => filter.name === propertie.name
                        ).value
                      }>
                      <option value="all">Todos</option>
                      {propertie.values.map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </Filter>
                ))}
                <Filter>
                  <span>Ordenar:</span>
                  <select
                    value={sort}
                    onChange={(ev) => {
                      setSort(ev.target.value);
                      setFiltersChanged(true);
                    }}>
                    <option value="price-asc">Precio, menor primero</option>
                    <option value="price-desc">Precio, mayor primero</option>
                    <option value="_id-desc">Nuevos primeros</option>
                    <option value="_id-asc">Antiguos primeros</option>
                  </select>
                </Filter>
              </FiltersWrapper>
            </>
          )}
          {loadingProducts && <Spinner fullWidth />}
          {!loadingProducts && (
            <div>
              {products.length > 0 && (
                <>
                  <ProductsGrid
                    products={products}
                    wishedProducts={wishedProducts}
                    currentPage={currentPage}
                    totalPages={totalPages}
                  />
                  <PaginationGrid
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePrevPage={handlePrevPage}
                    handleNextPage={handleNextPage}
                    setCurrentPageGrid={setCurrentPageGrid}
                    noPagination={totalPages === 1}
                  />
                </>
              )}
              {products.length === 0 && (
                <WhiteBoxNotFound>
                  <NoProductsWrapper>
                    <IconWrapper>
                      <InfoIcon />
                    </IconWrapper>{' '}
                    Lo sentimos, no se encontraron productos!
                  </NoProductsWrapper>
                </WhiteBoxNotFound>
              )}
            </div>
          )}
        </Center>
      </Bg>
      <Footer />
    </>
  );
}

export async function getServerSideProps(ctx) {
  const category = await Category.findById(ctx.query.id);
  const subCategories = await Category.find({ parent: category._id });
  const catIds = [
    category._id,
    ...subCategories.map((category) => category._id),
  ];
  const products = await Product.find({ category: catIds });

  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  const wishedProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session?.user?.email,
        product: products.map((product) => product._id.toString()),
      })
    : [];

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      subCategories: JSON.parse(JSON.stringify(subCategories)),
      wishedProducts: wishedProducts.map((item) => item.product.toString()),
    },
  };
}

