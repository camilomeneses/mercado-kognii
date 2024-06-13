import { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Center from './Center';
import Button from './Button';
import ButtonLink from './ButtonLink';
import CartSolidIcon from './icons/CartSolidIcon';
import { CartContext } from './CartContext';
import Images from './Images';
import Link from 'next/link';

const Bg = styled.div`
  /* background-color: #222; */
  background-image: url('/feactured_.webp');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom;
  color: #fff;
  padding: 50px 0 20px;
  border: 1px solid #222;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 3rem;
`;

const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  opacity: ${(props) => (props.fadeIn ? 1 : 0)};
  transition: opacity 0.5s ease;
  ${(props) =>
    props.noAnimation
      ? `
        opacity: 1; 
        transition: none;
      `
      : ``}

  img {
    max-width: 100%;
    max-height: 250px;
  }

  div:nth-child(1) {
    order: 2;
  }

  @media screen and (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;

    div:nth-child(1) {
      order: 0;
    }

    img {
      max-width: 100%;
    }
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const ColumnImage = styled.div`
  margin: 0 auto;
`;

const ImagesWrapper = styled.div`
  border-radius: 20px;
  display: flex;
`;

const ImagesContainer = styled.div`
  margin: auto;
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
  --size: 230px;
  --speed: 5s;
  --easing: cubic-bezier(0.2, 0.2, 0.2, 0.2);
  --color1: hsla(310, 99%, 40%, 0.623);
  --color2: hsla(0, 0%, 86%, 0.562);
  --color3: hsla(189, 100%, 45%, 0.514);

  position: absolute;
  top: 40px;
  left: 5px;
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

const ButtonsWrapper = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: 1fr;
  @media screen and (min-width: 285px) {
    display: flex;
    gap: 10px;
    margin-top: 25px;
  }
`;

const Greeting = styled.div`
  position: absolute;
  top: 80px;
  font-size: 1rem;

  @media screen and (min-width: 850px) {
    font-size: 2rem;
    top: 155px;
  }

  display: flex;
  z-index: 2;
`;

const NavLink = styled(Link)`
  display: block;
  color: #fff;
  text-decoration: none;
  min-width: 20px;
  text-align: end;
  font-weight: 600;
`;

const NavigationDotsWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  align-items: last baseline;
`;

const Dot = styled.button`
  width: 10px;
  height: 10px;
  margin: 0 15px;
  padding: 0;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? '#888' : '#ccc')};
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #888;
  }
`;

const ActiveDot = styled(Dot)`
  width: 40px;
  height: 10px;
  padding: 0;
  border-radius: 20px;
  cursor: default;
`;

export default function Feactured({ feacturedProducts, userName = '' }) {
  const { addProduct } = useContext(CartContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const NavigationDots = ({ count, currentIndex, onChangeIndex }) => {
    return (
      <NavigationDotsWrapper>
        {Array.from({ length: count }).map((_, index) =>
          index === currentIndex ? (
            <ActiveDot
              key={index}
              active
              onClick={() => onChangeIndex(index)}
              aria-label={`Slide ${index + 1}, current`}
            />
          ) : (
            <Dot
              key={index}
              onClick={() => onChangeIndex(index)}
              aria-label={`Slide ${index + 1}`}
            />
          )
        )}
      </NavigationDotsWrapper>
    );
  };

  function addFeacturedToCart(product) {
    addProduct(product._id);
  }

  function nextProduct() {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % feacturedProducts.length);
    setFadeIn(true);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeIn(false);
      setTimeout(nextProduct, 650); // Espera 500 ms para iniciar la transición de fade-out
    }, 20000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const product = feacturedProducts[currentIndex];

  return (
    <Bg>
      <Center>
        {userName !== '' ? (
          <Greeting>
            Buen día,&nbsp;
            <NavLink href={'/account#account-details'}>{userName}</NavLink>
          </Greeting>
        ) : (
          ''
        )}
        <ColumnsWrapper
          fadeIn={fadeIn}
          noAnimation={feacturedProducts.length <= 1}>
          <Column>
            <div>
              <Title>{product?.title}</Title>
              <Desc>{product?.description.split('.')[0]}</Desc>
              <ButtonsWrapper>
                <ButtonLink
                  white={1}
                  outline={1}
                  href={'/product/' + product?._id}>
                  Ver Detalles
                </ButtonLink>
                <Button
                  white={1}
                  animated={1}
                  onClick={() => addFeacturedToCart(product)}>
                  <CartSolidIcon />
                  Añadir
                </Button>
              </ButtonsWrapper>
            </div>
          </Column>
          <ColumnImage>
            <ImagesWrapper>
              <ImagesContainer>
                <Gradient></Gradient>
                <ImageWrapper>
                  <Images
                    quality={30}
                    priority
                    src={product?.images?.[0]}
                    alt={product?.title}
                  />
                </ImageWrapper>
              </ImagesContainer>
            </ImagesWrapper>
          </ColumnImage>
        </ColumnsWrapper>
        {feacturedProducts.length > 1 && (
          <NavigationDots
            count={feacturedProducts.length}
            currentIndex={currentIndex}
            onChangeIndex={setCurrentIndex}
          />
        )}
      </Center>
    </Bg>
  );
}

