import { useSession } from 'next-auth/react';
import styled, { css, keyframes } from 'styled-components';
import Images from './Images';
import { useState } from 'react';
import HeartSolidIcon from './icons/HeartSolidIcon';
import HeartOutlineIcon from './icons/HeartOutlineIcon';
import axios from 'axios';
import { useContext } from 'react';
import { WishlistContext } from './WishlistContext';

const ImageButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  justify-content: center;
`;

const ImageButton = styled.div`
  ${(props) => (props.active ? `border: 2px solid #aaa;` : `opacity: 0.7;`)}

  background-color: #fff;
  padding: 2px;
  height: 40px;
  cursor: pointer;
  border-radius: 10px;
`;

// TODO zoom in Imagen Producto
const BigImage = styled.img`
  background-color: #fff;
  max-width: 100%;
  max-height: 300px;
  border-radius: 10px;
  -webkit-box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);
  -moz-box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);
  box-shadow: -14px 12px 18px -11px rgba(15, 15, 15, 0.42);
  cursor: zoom-in;
`;

const BigImageWrapper = styled.div`
  text-align: center;
  position: relative;
  max-width: 50%;
  margin: 0 auto;

  @media screen and (min-width: 768px) {
    /* Modo desktop */
    max-width: 100%;
  }

  @media screen and (max-width: 667px) and (orientation: portrait) {
    /* Móviles en orientación vertical */
    max-width: 100%;
  }
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 101;
`;

const ModalContent = styled.div`
  max-width: 90%;
  max-height: 100%;
  overflow: hidden;
  border-radius: 30px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (min-width: 376px) {
    max-width: 50%;
    max-height: 95%;
  }

  @media screen and (max-width: 667px) and (orientation: portrait) {
    /* Móviles en orientación vertical */
    max-width: 90%;
  }
`;

const ModalImage = styled.img`
  width: 90%;
  height: 90%;
  border-radius: 10px;
  object-fit: contain;
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
    transform: rotate(-10deg);
  }
  30% {
    transform: rotate(10deg);
  }
  40% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(-10deg);
  }
  70% {
    transform: rotate(10deg);
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

const WishtlistButtonProduct = styled.button`
  box-sizing: border-box;
  border: 0px solid #fff;
  background-color: #ffffffbc;
  width: 40px !important;
  height: 40px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 5px;
  right: 15px;
  border-radius: 20px;
  z-index: 2;
  cursor: pointer;
  transition: border 0.2s ease-in;

  :hover {
    border: 2px solid #eee;
  }

  ${(props) => (props.wished ? `color:red;` : `color:black;`)}

  ${(props) =>
    props.animate &&
    css`
      animation: ${shakeAnimation} 1s linear 0s 1 normal none;
    `}

  svg {
    width: 20px;
  }
`;

export default function ProductImages({
  images,
  wished = false,
  onRemoveFromWishlist = () => {},
  _id,
}) {
  const { data: session } = useSession();
  const [activeImage, setActiveImage] = useState(images?.[0]);
  const [modalOpen, setModalOpen] = useState(false);
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

  const handleImageClick = (image) => {
    setActiveImage(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <BigImageWrapper>
        {session && (
          <WishtlistButtonProduct
            wished={isWished}
            onClick={addtoWishlist}
            animate={isWished}>
            {isWished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
          </WishtlistButtonProduct>
        )}
        <BigImage
          src={activeImage}
          alt="product image"
          onClick={() => handleImageClick(activeImage)}
        />
      </BigImageWrapper>
      <ImageButtons>
        {images.length > 1 && images.map((image) => (
          <ImageButton
            active={image === activeImage}
            key={image}
            onClick={() => setActiveImage(image)}>
            <Images src={image} alt={'product image'} />
          </ImageButton>
        ))}
      </ImageButtons>

      {modalOpen && (
        <ModalWrapper onClick={closeModal}>
          <ModalContent>
            <ModalImage src={activeImage} alt="product image" />
          </ModalContent>
        </ModalWrapper>
      )}
    </>
  );
}

