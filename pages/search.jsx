import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import debounce from 'lodash/debounce';
import styled from 'styled-components';
import SearchImage from '@/assets/search.webp';
import Header from '@/components/Header';
import ProductsGrid from '@/components/ProductsGrid';
import Spinner from '@/components/Spinner';
import Center from '@/components/Center';
import CenterContent from '@/components/CenterContent';
import PaginationGrid from '@/components/PaginationGrid';
import Footer from '@/components/Footer';
import Images from '@/components/Images';

const SearchInput = styled.input`
  font-size: 1.5rem;
  padding: 3px 10px;
  background-color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
  width: 100%;
  border: 1px solid #aaa;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 1.1rem;
  font-family: inherit;
`;

const InputWrapper = styled.div`
  position: sticky;
  top: 105px;
  margin: 0 auto;
  width: 90%;
  z-index: 1;

  @media screen and (max-width: 768px) {
    margin: 0;
    top: 20px;
    width: 90%;

    &.scrolled {
      top: 20px;

      ${(props) =>
        props.session
          ? `width: calc(100% - 125px);`
          : `width: calc(100% - 80px);`}
    }
  }
`;

const Bg = styled.div`
  background-image: url('/cart-bg.svg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 30px 0 0 0;
  @media screen and (min-width: 768px) {
    padding: 30px 0 0 0;
  }
`;

const ImagesWrapper = styled.div`
  padding: 60px 0;
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

export default function SearchPage({ wishedProducts }) {
  const [phrase, setPhrase] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data: session } = useSession();
  const productsPerPage = 8;

  const debouncedSearch = useCallback(debounce(searchProducts, 800), []);

  useEffect(() => {
    if (phrase.length > 0) {
      setIsLoading(true);
      setCurrentPage(1); // Reiniciar currentPage cuando se realiza una nueva búsqueda
      debouncedSearch(phrase);
    } else {
      setProducts([]);
    }
  }, [phrase]);

  function searchProducts(phrase) {
    axios
      .get('/api/products', {
        params: {
          phrase,
          currentPage, // Utilizar currentPage: 1 para obtener los resultados de la primera página
          productsPerPage: productsPerPage.toString(),
        },
      })
      .then((response) => {
        const { currentPage, totalPages, products } = response.data;
        setProducts(products);
        setCurrentPage(currentPage);
        setTotalPages(totalPages);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.pageYOffset > 50);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const inputWrapper = document.getElementById('inputWrapper');
    if (isScrolled) {
      inputWrapper.classList.add('scrolled');
    } else {
      inputWrapper.classList.remove('scrolled');
    }
  }, [isScrolled]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const setCurrentPageGrid = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (phrase.length > 0) {
      setIsLoading(true);
      searchProducts(phrase);
    }
  }, [currentPage]); // Agregar el currentPage como dependencia del efecto para actualizar la página actual

  return (
    <>
      <Header />
      <Bg>
        <Center>
          <InputWrapper id="inputWrapper" session={session}>
            <SearchInput
              autoFocus
              placeholder="Buscando vecino..."
              label="Search"
              value={phrase}
              onChange={(ev) => setPhrase(ev.target.value)}
            />
          </InputWrapper>
          {!phrase && (
            <div>
              <ImagesWrapper>
                <ImagesContainer>
                  <Gradient></Gradient>
                  <ImageWrapper>
                    <Images
                      quality={90}
                      priority
                      src={SearchImage}
                      alt={'search'}
                    />
                  </ImageWrapper>
                </ImagesContainer>
              </ImagesWrapper>
            </div>
          )}
          {!isLoading && phrase !== '' && products.length === 0 && (
            <h2>No products found for query &quot;{phrase}&quot;</h2>
          )}
          {isLoading && <Spinner fullWidth />}
          {!isLoading && products.length > 0 && (
            <CenterContent>
              <ProductsGrid
                products={products}
                wishedProducts={wishedProducts}
              />
              {totalPages > 1 && (
                <PaginationGrid
                  currentPage={currentPage}
                  totalPages={totalPages}
                  handlePrevPage={handlePrevPage}
                  handleNextPage={handleNextPage}
                  setCurrentPageGrid={setCurrentPageGrid}
                  noPagination={totalPages === 1}
                />
              )}
            </CenterContent>
          )}
        </Center>
      </Bg>
      <Footer />
    </>
  );
}

