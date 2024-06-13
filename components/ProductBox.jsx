import { useContext, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import styled, { css, keyframes } from 'styled-components';
import Button from './Button';
import CartSolidIcon from './icons/CartSolidIcon';
import { CartContext } from './CartContext';
import Images from './Images';
import HeartOutlineIcon from './icons/HeartOutlineIcon';
import HeartSolidIcon from './icons/HeartSolidIcon';
import { danger } from '@/lib/colors';
import { WishlistContext } from './WishlistContext';

const ProductWrapper = styled.div`
  border-radius: 10px;
  &:hover {
    -webkit-box-shadow: 0px 8px 23px 3px rgba(0, 0, 0, 0.42);
    -moz-box-shadow: 0px 8px 23px 3px rgba(0, 0, 0, 0.42);
    box-shadow: 0px 8px 23px 3px rgba(0, 0, 0, 0.42);
  }
`;

const WhiteBox = styled(Link)`
  position: relative;
  background-color: #fff;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 160px;
  border-radius: 10px 10px 0 0;
  -webkit-box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);
  -moz-box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);
  box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);
`;

const Title = styled(Link)`
  color: inherit;
  text-decoration: none;
  font-weight: normal;
  font-size: 1rem;
  margin: 0;
  color: #fff;
`;

const ProductInfoBox = styled.div`
  padding: 10px 10px;
  background-color: #222;
  border-radius: 0 0 10px 10px;
  -webkit-box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);
  -moz-box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);
  box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  margin-top: 2px;
`;

const Price = styled.div`
  padding-left: 5px;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: start;
  color: #fff;
`;

const shakeAnimation = keyframes`
  0% {
    transform: rotate(0deg);
    transform-origin: 50% 50%;
  }
  10% {
    transform: rotate(8deg);
  }
  20% {
    transform: rotate(-9deg);
  }
  30% {
    transform: rotate(9deg);
  }
  40% {
    transform: rotate(-9deg);
  }
  50% {
    transform: rotate(9deg);
  }
  60% {
    transform: rotate(-9deg);
  }
  70% {
    transform: rotate(9deg);
  }
  80% {
    transform: rotate(-8deg);
  }
  90% {
    transform: rotate(8deg);
  }
  100% {
    transform: rotate(0deg);
    transform-origin: 50% 50%;
  }
`;

const WishtlistButton = styled.button`
  box-sizing: border-box;
  border: 0px solid #fff;
  width: 40px !important;
  height: 40px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 5px;
  right: 5px;
  background-color: transparent;
  border-radius: 20px;
  z-index: 2;
  cursor: pointer;
  transition: border 0.2s ease-in;

  :hover {
    border: 2px solid #eee;
  }

  ${(props) => (props.wished ? `color:${danger};` : `color:black;`)}

  ${(props) =>
    props.animate &&
    css`
      animation: ${shakeAnimation} 1s linear 0s 1 normal none;
    `}

  svg {
    width: 20px;
  }
`;

export default function ProductBox({
  _id,
  title,
  description,
  price,
  images,
  wished = false,
  onRemoveFromWishlist = () => {},
}) {
  const { data: session } = useSession();
  const { addProduct } = useContext(CartContext);
  const url = '/product/' + _id;
  const router = useRouter();

  //* double click feactured
  /*  let lastClickTime = 0;

  const doubleClickDelay = 300; // Milisegundos */

  const handleClick = (e) => {
    e.preventDefault();
    router.push(url);
    /*
    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime <= doubleClickDelay) {
      //TODO Se hizo doble clic, redirigir al usuario a la página correspondiente
      router.push(url);
    } else {
      //TODO Se hizo un solo clic, actualizar el tiempo del último clic
      lastClickTime = currentTime;
    } */
  };

  // TODO Wishlist event
  const [isWished, setIsWished] = useState(wished);
  const { fetchWishedProducts } = useContext(WishlistContext);

  function addtoWishlist(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const nextValue = !isWished;

    if (nextValue === false && onRemoveFromWishlist) {
      onRemoveFromWishlist(_id);
    }

    axios
      .post('/api/wishlist', {
        product: _id,
      })
      .then(() => {});

    fetchWishedProducts();
    setIsWished(nextValue);

    // Agregar la siguiente línea para activar la animación
    ev.currentTarget.classList.add('animate');
  }

  function truncateString(text, maxLength) {
    const words = text.split(' ');

    if (text.length <= maxLength) {
      return text;
    }

    let truncatedText = '';
    let count = 0;

    for (let i = 0; i < words.length; i++) {
      if (count + words[i].length <= maxLength) {
        truncatedText += words[i] + ' ';
        count += words[i].length + 1;
      } else {
        break;
      }
    }

    truncatedText = truncatedText.trim();

    if (truncatedText.length < text.length) {
      truncatedText += '...';
    }

    return truncatedText;
  }

  const truncatedText = truncateString(title, 17);

  const formattedPrice = price.toLocaleString('es-ES');

  return (
    <ProductWrapper>
      <WhiteBox href={url} onClick={handleClick}>
        <div>
          {session && (
            <WishtlistButton
              wished={isWished}
              onClick={addtoWishlist}
              animate={isWished}
              aria-label={`wished ${isWished}`}>
              {isWished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
            </WishtlistButton>
          )}
        </div>
        <Images src={images[0]} alt={title} />
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{truncatedText}</Title>
        <Price>$ {formattedPrice}</Price>
        <PriceRow>
          <Button
            primary={true}
            block={true}
            animated={true}
            onClick={() => addProduct(_id)}>
            <CartSolidIcon />
            Añadir
          </Button>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}

