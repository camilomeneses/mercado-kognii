import Button from '@/components/Button';
import { CartContext } from '@/components/CartContext';
import Center from '@/components/Center';
import Header from '@/components/Header';
import ProductImages from '@/components/ProductImages';
import Title from '@/components/Title';
import CartSolidIcon from '@/components/icons/CartSolidIcon';
import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { useContext } from 'react';
import styled from 'styled-components';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { WishedProduct } from '@/models/WishedProduct';
import CenterContent from '@/components/CenterContent';
import ProductReviews from '@/components/ProductReviews';
import Footer from '@/components/Footer';

const Bg = styled.div`
  background-image: url('/product-bg.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 80vh;
  padding: 40px 0;
`;

const SubTitle = styled.h2`
  font-weight: 500;
  padding: 10px 0 5px;
  margin: 0;
`;

const DetailsWrapper = styled.div`
  padding-top: 10px;
`;

const DescriptionWrapper = styled.div`
  margin: 10px 0 40px;
`;

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;

  @media screen and (min-width: 768px) {
    grid-template-columns: 0.8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0 10px;
`;

const Box = styled.div`
  background-color: transparent;
  border-radius: 10px;
  padding: 0;
  @media screen and (min-width: 768px) {
    padding: 20px 0;
  }
`;

const PriceRow = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: 1fr;
  text-align: center;

  @media screen and (min-width: 600px) {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: end;
  }
`;

const Price = styled.span`
  font-size: 2rem;
  font-weight: 600;
`;

const ProductDescription = styled.p`
  text-align: justify;
`;

const EspecificationsWrapper = styled.div`
  background-color: #fff;
  width: auto;
  padding: 5px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  -webkit-box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);
  -moz-box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);
  box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);

  & > div:last-child {
    border-bottom: none;
  }
`;

const EspecificationLine = styled.div`
  display: flex;
  gap: 10px;
  position: relative;
  padding: 5px 0;

  border-bottom: 1px solid #bbbbbb;
`;

const EspecificationTitle = styled.div`
  text-transform: capitalize;
  font-weight: 500;
`;

const EspecificationValue = styled.div`
  font-weight: 700;
`;

export default function ProductPage({ product, wishedProduct }) {
  const { addProduct } = useContext(CartContext);
  const filters = product?.properties || {};
  let especifications = [];

  // TODO Busqueda por medio de filtros dinamicos
  if (Object.keys(filters).length > 0) {
    Object.keys(filters).forEach((filterName) => {
      especifications = [
        ...especifications,
        { name: filterName, value: filters[filterName] },
      ];
    });
  }

  return (
    <>
      <Header />
      <Bg>
        <Center>
          <CenterContent>
            <Title>{product.title}</Title>
            <ColWrapper>
              <Box>
                <ProductImages
                  images={product.images}
                  wished={wishedProduct.length > 0}
                  _id={product._id}
                />
              </Box>
              <DetailsWrapper>
                {especifications.length > 0 && (
                  <>
                    <SubTitle>Especificaciones</SubTitle>
                    <EspecificationsWrapper>
                      {especifications.map((propertie) => (
                        <EspecificationLine key={propertie.name}>
                          <EspecificationTitle>
                            {propertie.name}:
                          </EspecificationTitle>
                          <EspecificationValue>
                            {propertie.value}
                          </EspecificationValue>
                        </EspecificationLine>
                      ))}
                    </EspecificationsWrapper>
                  </>
                )}
                <div>
                  <PriceRow>
                    <Price>$ {product.price.toLocaleString('es-ES')}</Price>
                    <Button
                      size={'l'}
                      primary={1}
                      animated={1}
                      onClick={() => addProduct(product._id)}>
                      <CartSolidIcon />
                      Añadir
                    </Button>
                  </PriceRow>
                </div>
              </DetailsWrapper>
            </ColWrapper>
            <DescriptionWrapper>
              <SubTitle>Descripción</SubTitle>
              <ProductDescription>{product.description}</ProductDescription>
            </DescriptionWrapper>
          </CenterContent>
          <ProductReviews product={product} />
        </Center>
      </Bg>
      <Footer />
    </>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();
  const { id } = ctx.query;
  const product = await Product.findById(id);

  // TODO obtener session
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  // TODO Traer productos en lista de deseos
  const wishedProduct = session?.user
    ? await WishedProduct.find({
        userEmail: session?.user?.email,
        product: product._id.toString(),
      })
    : [];

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      wishedProduct: JSON.parse(
        JSON.stringify(wishedProduct.map((wp) => wp._id.toString()))
      ),
    },
  };
}

