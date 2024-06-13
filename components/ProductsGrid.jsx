import styled from 'styled-components';
import ProductBox from './ProductBox';

const StyledProductsGridContainer = styled.div`
  min-height: 367px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 0 30px 0;
`;

const StyledProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;

  @media screen and (min-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (min-width: 710px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media screen and (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

export default function ProductsGrid({ products, wishedProducts = [] }) {
  return (
    <StyledProductsGridContainer>
      <StyledProductsGrid>
        {products?.length > 0 &&
          products.map((product) => (
            <ProductBox
              key={product._id}
              {...product}
              wished={wishedProducts.includes(product._id)}
            />
          ))}
      </StyledProductsGrid>
    </StyledProductsGridContainer>
  );
}


