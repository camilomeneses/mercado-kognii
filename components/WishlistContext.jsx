import { createContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { data: session } = useSession();
  const [wishedAllProducts, setWishedAllProducts] = useState([]);

  const fetchWishedProducts = async () => {
    // Lógica para obtener los productos deseados en tiempo real
    const response = await fetch('/api/auth/session');
    const session = await response.json();

    const wishedAllProductsResponse = await fetch('/api/wishlist', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    const wishedAllProductsData = await wishedAllProductsResponse.json();
    setWishedAllProducts(wishedAllProductsData);
  };
  
  useEffect(() => {
    if(!session) return;
    fetchWishedProducts();
  }, [session]);

  return (
    <WishlistContext.Provider
      value={{ wishedAllProducts, fetchWishedProducts }}>
      {children}
    </WishlistContext.Provider>
  );
};

