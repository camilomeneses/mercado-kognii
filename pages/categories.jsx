import Center from '@/components/Center';
import Header from '@/components/Header';
import ProductBox from '@/components/ProductBox';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import Link from 'next/link';
import styled from 'styled-components';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { WishedProduct } from '@/models/WishedProduct';
import Footer from '@/components/Footer';

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(200px, 1fr);
  gap: 20px;
  background-color: #e6e6e681;
  border-radius: 10px;
  padding: 20px;

  @media screen and (min-width: 475px) {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media screen and (min-width: 630px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }

  @media screen and (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 30px;
  }
`;

const CategoryTitle = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  font-weight: 700;
  align-items: left;
  justify-content: start;
  gap: 5px;
  padding-bottom: 5px;

  a {
    color: #555;
    font-weight: 400;
    text-decoration: none;
    white-space: nowrap;
  }

  h2 {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  @media screen and (min-width: 400px) {
    flex-direction: row;
    align-items: center;
    gap: 15px;
  }
`;

const CategoryWrapper = styled.div`
  margin-bottom: 40px;
`;

const ShowAllSquare = styled(Link)`
  background-color: #d8d8d8;
  min-height: 160px;
  max-height: auto;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  text-decoration: none;

  -webkit-box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);
  -moz-box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);
  box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);

  &:hover {
    -webkit-box-shadow: 0px 8px 23px 3px rgba(0, 0, 0, 0.42);
    -moz-box-shadow: 0px 8px 23px 3px rgba(0, 0, 0, 0.42);
    box-shadow: 0px 8px 23px 3px rgba(0, 0, 0, 0.42);
  }
`;

const Bg = styled.div`
  background-image: url('/categories-bg.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 80vh;
  padding: 40px 0;
`;

export default function CategoriesPage({
  mainCategories,
  categoriesProducts,
  wishedProducts = [],
}) {
  return (
    <>
      <Header />
      <Bg>
        <Center>
          {mainCategories.map((category) => (
            <div key={category._id}>
              <CategoryWrapper>
                <CategoryTitle>
                  <h2>{category.name}</h2>
                  <div>
                    <Link href={'/category/' + category._id}>
                      Mirar Todos &rarr;
                    </Link>
                  </div>
                </CategoryTitle>
                <CategoryGrid>
                  {categoriesProducts[category._id].map((product) => (
                    <ProductBox
                      key={product._id}
                      {...product}
                      wished={wishedProducts.includes(product._id)}
                    />
                  ))}
                  <ShowAllSquare href={'/category/' + category._id}>
                    Mirar Todos &rarr;
                  </ShowAllSquare>
                </CategoryGrid>
              </CategoryWrapper>
            </div>
          ))}
        </Center>
      </Bg>
      <Footer />
    </>
  );
}

export async function getServerSideProps(ctx) {
  const categories = await Category.find();
  const mainCategories = categories.filter((c) => !c.parent);
  const categoriesProducts = {}; //catId => [products]
  const allFetchedProductsId = [];

  for (const mainCat of mainCategories) {
    const mainCatId = mainCat._id.toString();

    const childCatIds = categories
      .filter((category) => category?.parent?.toString() === mainCatId)
      .map((category) => category._id.toString());

    const categoriesIds = [mainCat, ...childCatIds];

    const products = await Product.find({ category: categoriesIds }, null, {
      limit: 3,
      sort: { _id: -1 },
    });

    allFetchedProductsId.push(
      ...products.map((product) => product._id.toString())
    );
    categoriesProducts[mainCat._id] = products;
  }
  // TODO obtener session
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  // TODO Traer productos en lista de deseos
  const wishedProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session?.user?.email,
        product: allFetchedProductsId,
      })
    : [];

  return {
    props: {
      mainCategories: JSON.parse(JSON.stringify(mainCategories)),
      categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
      wishedProducts: wishedProducts.map((item) => item.product.toString()),
    },
  };
}

