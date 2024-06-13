import Center from '@/components/Center';
import Header from '@/components/Header';
import ProductsGrid from '@/components/ProductsGrid';
import Title from '@/components/Title';
import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import styled from 'styled-components';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { WishedProduct } from '@/models/WishedProduct';
import { useState } from 'react';
import CenterContent from '@/components/CenterContent';
import Footer from '@/components/Footer';
import PaginationGrid from '@/components/PaginationGrid';
import { useEffect } from 'react';
import axios from 'axios';
import Spinner from '@/components/Spinner';

const Bg = styled.div`
  background-image: url('/allproducts-bg.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 80vh;
  padding: 40px 0;
`;

export default function ProductsPage({ wishedProducts }) {
  // para paginacion ProductsGrid
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const productsPerPage = 8;

  useEffect(() => {
    setLoadingProducts(true);

    const params = new URLSearchParams();
    params.set('currentPage', currentPage.toString());
    params.set('productsPerPage', productsPerPage.toString());

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
  }, [currentPage]);

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
          <Title>Todos los Productos</Title>
          <CenterContent>
            {loadingProducts && <Spinner fullWidth={true} />}
            {!loadingProducts && (
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
          </CenterContent>
        </Center>
      </Bg>
      <Footer />
    </>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const products = await Product.find({}, null, { sort: { _id: -1 } });
  // TODO obtener session
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  // TODO Traer productos en lista de deseos
  const wishedProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session?.user?.email,
        product: products.map((product) => product._id.toString()),
      })
    : [];

  return {
    props: {
      wishedProducts: wishedProducts.map((item) => item.product.toString()),
    },
  };
}

