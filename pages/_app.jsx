import { poppins } from '@/lib/font';
import { CartContextProvider } from '@/components/CartContext';
import { createGlobalStyle } from 'styled-components';
import { NavContextProvider } from '@/components/NavContext';
import { SessionProvider } from 'next-auth/react';
import { WishlistProvider } from '@/components/WishlistContext';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import { SettingsProvider } from '@/components/SettingsContext';
import { Poppins } from 'next/font/google';

export const poppinsFont = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins-font',
});

const GlobalStyles = createGlobalStyle`
  *{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  
  body{
    background-color: #f0f0f0;
    padding: 0;
    margin: 0;
    font-family: var(--font-poppins-font),Verdana, Geneva, Tahoma, sans-serif;
    border:0;
    box-sizing: border-box;
  }
`;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  return (
    <>
      <SessionProvider session={session}>
        <ReCaptchaProvider reCaptchaKey={reCaptchaKey}>
          <SettingsProvider>
            <NavContextProvider>
              <WishlistProvider>
                <CartContextProvider>
                  <GlobalStyles />
                  <Component {...pageProps} />
                </CartContextProvider>
              </WishlistProvider>
            </NavContextProvider>
          </SettingsProvider>
        </ReCaptchaProvider>
      </SessionProvider>
    </>
  );
}


