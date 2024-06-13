'use client';

import { poppins } from '@/lib/font';
import Header from '@/components/Header';
import styled from 'styled-components';
import Center from '@/components/Center';
import Button from '@/components/Button';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/components/CartContext';
import axios from 'axios';
import Table from '@/components/Table';
import Images from '@/components/Images';
import Spinner from '@/components/Spinner';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import InputDisabled from '@/components/InputDisabled';
import CartImage from '@/assets/cart.webp';
import Footer from '@/components/Footer';

const WhiteBoxCart = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;

  ${({ noProducts }) =>
    !!noProducts &&
    `
        div:nth-child(1) {
        order: 2;
        }
      `}
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr 0.8fr;

    ${({ noProducts }) =>
      !!noProducts &&
      `
          div:nth-child(1) {
          order: 0;
          }
        `}
  }
  gap: 40px;
  margin: 40px 0;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageWhiteBox = styled.div`
  width: 70px;
  height: 70px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 60px;
    max-height: 60px;
  }

  @media screen and (min-width: 768px) {
    width: 100px;
    height: 100px;
    padding: 10px;

    img {
      max-width: 90px;
      max-height: 90px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: flexbox;
  @media screen and (min-width: 768px) {
    display: inline-block;
  }
`;

const CityHolder = styled.div`
  display: grid;
  gap: 10px;
  grid-auto-flow: column;
`;

const TipSpan = styled.p`
  font-size: 0.8rem;
`;

const Bg = styled.div`
  background-image: url('/bg.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 80vh;
  padding-top: 40px;
`;

const EditButton = styled(Button)`
  margin-bottom: 15px;
`;

const ContinueButton = styled(Button)`
  margin-top: 15px;
`;

const ImagesWrapper = styled.div`
  border-radius: 20px;
  width: 250px;
  display: flex;
  margin: auto;
`;

const ImagesContainer = styled.div`
  position: relative;
`;

const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: levitate 6s ease-in-out infinite alternate;

  @keyframes levitate {
    0% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-10px) rotate(3deg);
    }
    100% {
      transform: translateY(0) rotate(0deg);
    }
  }
`;

const Gradient = styled.div`
  --size: 200px;
  --speed: 5s;
  --easing: cubic-bezier(0.2, 0.2, 0.2, 0.2);
  --color1: hsla(310, 99%, 40%, 1);
  --color2: hsla(221, 64%, 38%, 1);
  --color3: hsla(189, 100%, 45%, 1);

  position: absolute;
  top: 0px;
  left: 30px;
  width: var(--size);
  height: var(--size);
  background-image: conic-gradient(var(--color1), var(--color2), var(--color3));
  animation: rotate var(--speed) var(--easing) infinite;
  border-radius: 50%;
  filter: blur(40px);

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loaded, setLoaded] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  // TODO traer los elementos de la base de datos
  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', { ids: cartProducts }).then((response) => {
        setProducts(response.data);
      });
    } else {
      // TODO vaciar productos en cart y eliminar en LocalStorage
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
    }
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }
    setLoaded(false);
    // traer data del user para formulario del cart
    axios.get('/api/address').then((response) => {
      setName(response.data?.name || '');
      setEmail(response.data?.email || '');
      setCity(response.data?.city || '');
      setPostalCode(response.data?.postalCode || '');
      setStreetAddress(response.data?.streetAddress || '');
      setCountry(response.data?.country || '');
      setLoaded(true);
    });
  }, [session]);

  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  async function login() {
    await signIn();
  }

  function GoToAccount() {
    router.push('/account');
  }

  async function goToPayment() {
    const response = await axios.post('/api/checkout', {
      name,
      email,
      city,
      postalCode,
      streetAddress,
      country,
      cartProducts,
    });
    if (response.data.url) {
      window.location = response.data.url;
    }
  }

  function goToAccount() {
    router.push('/account#account-details');
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    total += price;
  }

  // TODO pago realizado
  if (isSuccess) {
    return (
      <>
        <Header black={true} />
        <Center>
          <ColumnsWrapper>
            <WhiteBoxCart>
              <h1>Thanks for your order!</h1>
              <p>We will email you when your order will be sent.</p>
            </WhiteBoxCart>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header black={true} />
      <Bg>
        <Center>
          <ColumnsWrapper noProducts={!cartProducts?.length}>
            <div>
              <WhiteBoxCart>
                <h2>Cart</h2>
                {!cartProducts?.length && <div>Your cart is empty</div>}
                {products?.length > 0 && cartProducts?.length && (
                  <Table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id}>
                          <ProductInfoCell>
                            <ProductImageWhiteBox>
                              <Images
                                src={product.images?.[0]}
                                alt={product.title}
                              />
                            </ProductImageWhiteBox>
                            {product.title}
                          </ProductInfoCell>
                          <td>
                            <Button
                              onClick={() => lessOfThisProduct(product._id)}>
                              -
                            </Button>
                            <QuantityLabel>
                              {
                                cartProducts.filter((id) => id === product._id)
                                  .length
                              }
                            </QuantityLabel>
                            <Button
                              onClick={() => moreOfThisProduct(product._id)}>
                              +
                            </Button>
                          </td>
                          <td>
                            $
                            {cartProducts.filter((id) => id === product._id)
                              .length * product.price}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td></td>
                        <td></td>
                        <td>${total}</td>
                      </tr>
                    </tbody>
                  </Table>
                )}
              </WhiteBoxCart>
            </div>
            {!!cartProducts?.length && (
              <div>
                <WhiteBoxCart>
                  <h2>{session ? 'Order Information' : 'Login'}</h2>
                  {!loaded && session && <Spinner fullWidth />}
                  {loaded && session && (
                    <>
                      {[city, postalCode, streetAddress, country].every(
                        (p) => p.length !== 0
                      ) ? (
                        <>
                          <InputDisabled label={'Name'}>{name}</InputDisabled>
                          <InputDisabled label={'Email'}>{email}</InputDisabled>
                          <CityHolder>
                            <div>
                              <InputDisabled label={'City'}>
                                {city}
                              </InputDisabled>
                            </div>
                            <div>
                              <InputDisabled label={'Postal Code'}>
                                {postalCode}
                              </InputDisabled>
                            </div>
                          </CityHolder>
                          <InputDisabled label={'Street Address'}>
                            {streetAddress}
                          </InputDisabled>
                          <InputDisabled label={'Country'}>
                            {country}
                          </InputDisabled>

                          <TipSpan>
                            If the previous information is incorrect, you can
                            edit it by clicking on the Edit Order Information
                            button
                          </TipSpan>

                          <EditButton black={1} block={1} onClick={goToAccount}>
                            Edit Order Information
                          </EditButton>
                          <hr></hr>
                          <ContinueButton
                            primary={1}
                            block={1}
                            onClick={goToPayment}>
                            Continue to payment
                          </ContinueButton>
                        </>
                      ) : (
                        <>
                          <TipSpan>
                            Please make sure to have all the location fields
                            filled out for the successful delivery of our
                            products to your destination.
                            <br />
                            <br />
                            Once you have filled out the requested information,
                            you will be able to proceed with your purchase.
                          </TipSpan>
                          <hr></hr>
                          <Button black={1} block={1} onClick={GoToAccount}>
                            Go to Account
                          </Button>
                        </>
                      )}
                    </>
                  )}
                  {!session && (
                    <>
                      <p>
                        To continue with the payment process, please log in.
                      </p>
                      <Button primary={1} onClick={login} block={true}>
                        Login
                      </Button>
                    </>
                  )}
                </WhiteBoxCart>
              </div>
            )}
            {!cartProducts?.length && (
              <div>
                <ImagesWrapper>
                  <ImagesContainer>
                    <Gradient></Gradient>
                    <ImageWrapper>
                      <Images
                        quality={90}
                        priority
                        src={CartImage}
                        alt={'lock'}
                      />
                    </ImageWrapper>
                  </ImagesContainer>
                </ImagesWrapper>
              </div>
            )}
          </ColumnsWrapper>
        </Center>
        <Footer transparent={true} />
      </Bg>
    </>
  );
}

