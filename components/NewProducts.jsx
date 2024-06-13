import styled from 'styled-components';
import Center from './Center';
import ProductsGrid from './ProductsGrid';
import { useState } from 'react';
import CenterContent from './CenterContent';
import Link from 'next/link';

const Title = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  font-weight: 700;
  align-items: left;
  justify-content: start;
  gap: 5px;
  padding-bottom: 5px;

  div {
    white-space: nowrap;
  }

  a {
    color: #555;
    font-weight: 400;
    text-decoration: none;
  }

  h2 {
    margin: 10px 0;
  }

  @media screen and (min-width: 400px) {
    flex-direction: row;
    align-items: center;
    gap: 15px;
  }
`;

const Bg = styled.div`
  background-image: url('/categories-bg.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: auto;
  padding: 40px 0;
`;

export default function NewProducts({ products, wishedProducts }) {
  // para paginacion ProductsGrid
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <Bg>
      <Center>
        <Title>
          <h2>Nuevos Productos</h2>
          <div>
            <Link href={'/products'}>Mirar Todos &rarr;</Link>
          </div>
        </Title>
        <CenterContent>
          <ProductsGrid
            products={products}
            wishedProducts={wishedProducts}
            currentPage={currentPage}
            productsPerPage={products.length}
            setCurrentPage={setCurrentPage}
          />
        </CenterContent>
      </Center>
    </Bg>
  );
}
