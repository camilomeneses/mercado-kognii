import React, { useContext, useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import styled, { css, keyframes } from 'styled-components';
import Center from './Center';
import { CartContext } from './CartContext';
import { NavContext } from './NavContext';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  SearchIcon,
  AccountIcon,
  LogoutIcon,
  HeartOutlineIcon,
  CartOutlineIcon,
  XIcon,
} from './icons';
import { signOut, useSession } from 'next-auth/react';
import { danger } from '@/lib/colors';
import { WishlistContext } from './WishlistContext';

const StyledHeader = styled.header`
  padding-top: 20px;
  background-color: #222;
  z-index: 100;

  @media screen and (min-width: 850px) {
    ${(props) =>
      props.isFixedTop
        ? `
          position: fixed;
          top: -100%;
          left: 0;
          right: 0;
          padding: 0;
          background: ${props.black ? '#222222e8' : '#f0efefad'};
          backdrop-filter: blur(2.3px);
          -webkit-backdrop-filter: blur(2.3px);
          width: 100%;
          animation: slideDown 0.3s forwards;

          a{
            color:${props.black ? '#fff' : '#222'};
          }  
        `
        : ''}

    ${(props) =>
      props.isFixedBottom
        ? `
          position: fixed;
          bottom: -100%;
          left: 0;
          right: 0;
          padding: 0;
          background: ${props.black ? '#222222e8' : '#f0efefad'};
          backdrop-filter: blur(2.3px);
          -webkit-backdrop-filter: blur(2.3px);
          width: 100%;
          animation: slideUp 0.3s forwards;
          
          a{
            padding-top:5px;
            color:${props.black ? '#fff' : '#222'};
          }  
        `
        : ''}

    @keyframes slideDown {
      0% {
        top: -100%;
      }
      100% {
        top: 0;
      }
    }

    @keyframes slideUp {
      0% {
        bottom: -100%;
      }
      100% {
        bottom: 0;
      }
    }
  }
`;

const BackgroundLayer = styled.div`
  top: 0;
  left: 0;
  right: 0;
  height: 139px;
  background-color: #222;
  z-index: 99;
  display: none;

  /* para navbar desktop transparente */
  @media screen and (min-width: 850px) {
    ${(props) =>
      props.isFixedTop
        ? `
        display:block;
        `
        : `
        `}

    ${(props) =>
      props.isFixedBottom
        ? `
        display:block;
        `
        : ''}
  }
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 10px;

  ${(props) =>
    props.nav
      ? `
      display: flex;
      justify-content: center;

      @media screen and (min-width: 850px) {
        display: none;
      }
    `
      : ``}
`;

const Wrapper = styled.div`
  display: flex;
  align-items: baseline;
  padding: 20px 0;
  /* para navbar desktop transparente */
  @media screen and (min-width: 850px) {
    ${(props) =>
      props.isFixedTop
        ? `
          padding: 0;
        `
        : ''}

    ${(props) =>
      props.isFixedBottom
        ? `
          padding: 0;
        `
        : ''}
  }
`;

const StyledNav = styled.nav`
  position: fixed;
  top: 0;
  right: ${(props) => (props.mobileActiveNav ? '0' : `-60%`)};
  width: 60%;
  height: 100vh;
  background-color: #222;
  padding: 60px 20px 20px;
  transition:
    right 0.4s ease-in-out,
    box-shadow 0.4s ease-in-out;
  z-index: 11;

  ${(props) =>
    props.mobileActiveNav
      ? `
      -webkit-box-shadow: -71px 10px 48px 55px rgba(15, 15, 15, 0.42);
      -moz-box-shadow: -71px 10px 48px 55px rgba(15, 15, 15, 0.42);
      box-shadow: -71px 10px 48px 55px rgba(15, 15, 15, 0.42);
    `
      : ``}

  @media screen and (min-width: 850px) {
    display: flex;
    justify-content: center; /* Cambio de justify-items a justify-content */
    position: static;
    margin: 0 auto;
    height: auto;
    width: 100%;
    gap: 20px;
    box-shadow: none;
    transition:
      right 0s ease-in-out,
      box-shadow 0s ease-in-out;
    padding: 20px;
  }

  /* para navbar desktop transparente */
  @media screen and (min-width: 850px) {
    ${(props) =>
      props.isFixedTop
        ? `
          padding: 10px 0;
          background-color:transparent;
        `
        : ''}

    ${(props) =>
      props.isFixedBottom
        ? `
          padding: 0;
          background-color:transparent;
        `
        : ''}
  }
`;

const NavLink = styled(Link)`
  display: block;
  color: #fff;
  text-decoration: none;
  padding-top: 10px;
  min-width: 20px;
  text-align: end;

  svg {
    height: 20px;
  }

  /* Estilos condicionales */

  ${(props) =>
    props.separate
      ? ` 
      @media screen and (orientation: portrait) and (max-width: 850px) {
        margin-top: 45vh;
        padding-left: 0;
      }
      
      @media screen and (min-width: 850px) {
        padding-left: 20px;
      }
      `
      : ``}
`;

const NavButton = styled.button`
  background-color: #222;
  width: 35px;
  height: 35px;
  border: 2px solid #aaa;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  position: fixed;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  top: 20px;
  right: 20px;
  z-index: 10;

  svg {
    width: 20px;
    height: 20px;
  }
  @media screen and (min-width: 850px) {
    display: none;
  }
`;

//? --> Logos Menu

const LogoWithCounter = styled(Link)`
  background-color: #222;
  width: 35px;
  height: 35px;
  border: 2px solid #aaa;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  position: fixed;
  top: ${(props) => props.top};
  right: ${(props) => props.right};
  z-index: 9;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  svg {
    width: 20px;
    height: 20px;
  }

  span {
    position: absolute;
    top: -10px;
    right: -8px;
    background-color: ${danger};
    color: white;
    font-size: 12px;
    font-weight: bold;
    border-radius: 6px;
    text-align: center;
    justify-content: center;
    place-items: center;
    padding: 0.5px 5px;
  }

  @media screen and (min-width: 850px) {
    display: none;
  }
`;

const LogoNormal = styled(Link)`
  background-color: #222;
  width: 35px;
  height: 35px;
  border: 2px solid #aaa;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  position: fixed;
  top: ${(props) => props.top};
  right: ${(props) => props.right};
  z-index: 10;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  svg {
    width: 20px;
    height: 20px;
  }

  @media screen and (min-width: 850px) {
    display: none;
  }
`;

const ButtonNormal = styled.button`
  background-color: #222;
  width: 35px;
  height: 35px;
  border: 2px solid #aaa;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  position: fixed;
  top: ${(props) => props.top};
  right: ${(props) => props.right};
  z-index: 10;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  svg {
    width: 20px;
    height: 20px;
  }

  @media screen and (min-width: 850px) {
    display: none;
  }
`;

export default function Header({ black, name }) {
  const { cartProducts } = useContext(CartContext);
  const { mobileActiveNav, toggleMobileActiveNav, closeMobileNav } =
    useContext(NavContext);
  const ref = useRef();
  const router = useRouter();
  const { asPath } = router;
  /* const hideOnCartPath = asPath.startsWith('/cart') ? true : false; */
  const hideOnSearchPath = asPath.startsWith('/search') ? true : false;
  // para navfixed desktop screens
  const [isFixedTop, setIsFixedTop] = useState(false);
  const [isFixedBottom, setIsFixedBottom] = useState(false);
  const { data: session } = useSession();
  const { wishedAllProducts } = useContext(WishlistContext);

  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.pageYOffset;
      const windowWidth = window.innerWidth;

      if (asPath === '/' && windowWidth >= 769) {
        setIsFixedTop(scrollY > 480);
      } else if (asPath === '/search' && windowWidth >= 769) {
        setIsFixedBottom(scrollY > 99);
      } else if (windowWidth >= 769) {
        setIsFixedTop(scrollY > 99);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [asPath]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        closeMobileNav();
      }
    }
    document.addEventListener('touchstart' || 'click', handleClickOutside);
    return () => {
      document.removeEventListener('touchstart' || 'click', handleClickOutside);
    };
  }, [closeMobileNav]);

  return (
    <>
      <BackgroundLayer isFixedTop={isFixedTop} isFixedBottom={isFixedBottom} />
      <StyledHeader
        black={black}
        isFixedTop={isFixedTop}
        isFixedBottom={isFixedBottom}>
        <Center>
          <Wrapper isFixedTop={isFixedTop} isFixedBottom={isFixedBottom}>
            <Logo href={'/'}>Mercado Kognii</Logo>
            <StyledNav
              ref={ref}
              mobileActiveNav={mobileActiveNav}
              isFixedTop={isFixedTop}
              isFixedBottom={isFixedBottom}
              session={session}>
              <Logo nav={1} href={'/'}>
                Mercado Kognii
              </Logo>
              <NavLink href={'/'} aria-label="go to home page">
                Inicio
              </NavLink>
              <NavLink href={'/categories'} aria-label="go to categories page">
                Categorías
              </NavLink>
              <NavLink href={'/products'} aria-label="go to products page">
                Productos
              </NavLink>
              <NavLink href={'/account'} aria-label="go to account page">
                Cuenta {session && `(${wishedAllProducts.length})`}
              </NavLink>

              <NavLink href={'/cart'}>Carrito ({cartProducts.length})</NavLink>

              {!hideOnSearchPath && (
                <NavLink href={'/search'} aria-label="go to search page">
                  <SearchIcon />
                </NavLink>
              )}

              {session && (
                <NavLink
                  href={'/'}
                  onClick={logout}
                  separate={1}
                  aria-label="logout">
                  Salir
                </NavLink>
              )}

              {!session && (
                <NavLink href={'/account'} separate={1} aria-label="sign in">
                  Ingresar
                </NavLink>
              )}

              {/* Menu icon */}
              {/* close nav in desktop and movile */}
              <NavButton
                onClick={toggleMobileActiveNav}
                aria-label="open or close movile menu">
                {mobileActiveNav ? <XIcon /> : <HomeIcon />}
              </NavButton>
            </StyledNav>

            {/* extra icons conditional path */}
            <LogoNormal
              href={'/search'}
              top={'65px'}
              right={'20px'}
              aria-label="go to search page">
              <SearchIcon />
            </LogoNormal>

            {!session && (
              <LogoNormal
                href={'/account'}
                top={'110px'}
                right={'20px'}
                aria-label="go to account page">
                <AccountIcon />
              </LogoNormal>
            )}

            {session && (
              <LogoNormal
                href={'/account#account-details'}
                top={'110px'}
                right={'20px'}
                aria-label="go to account page">
                <AccountIcon />
              </LogoNormal>
            )}

            <LogoWithCounter
              href={'/cart'}
              top={'20px'}
              right={'65px'}
              aria-label="go to cart page">
              <CartOutlineIcon />
              <span>{cartProducts.length}</span>
            </LogoWithCounter>

            {session && (
              <>
                <LogoWithCounter
                  href={'/account#account-wishlist'}
                  top={'20px'}
                  right={'110px'}
                  aria-label="go to wishlist on account page">
                  <HeartOutlineIcon />
                  <span>{wishedAllProducts.length}</span>
                </LogoWithCounter>

                <ButtonNormal
                  onClick={logout}
                  top={'155px'}
                  right={'20px'}
                  aria-label="logout">
                  <LogoutIcon />
                </ButtonNormal>
              </>
            )}
          </Wrapper>
        </Center>
      </StyledHeader>
    </>
  );
}

