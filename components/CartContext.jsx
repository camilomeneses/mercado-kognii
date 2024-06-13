const { createContext, useState, useEffect } = require('react');

export const CartContext = createContext({});

export function CartContextProvider({ children }) {
  // TODO guardar o leer localStorage y traer data para cart
  const ls = typeof window !== 'undefined' ? window.localStorage : null;
  const [cartProducts, setCartProducts] = useState([]);
  
  useEffect(() => {
    if (ls && ls.getItem('cart')) {
      setCartProducts(JSON.parse(ls.getItem('cart')));
    }
  }, []);

  useEffect(() => {
    if (cartProducts?.length > 0) {
      ls?.setItem('cart', JSON.stringify(cartProducts));
    } else {
      ls?.removeItem('cart');
    }
  }, [cartProducts]);
  

  // TODO agregar producto a cart
  function addProduct(productId) {
    setCartProducts((prev) => [...prev, productId]);
  }

  // TODO quitar producto a cart
  function removeProduct(productId) {
    setCartProducts((prev) => {
      const pos = prev.indexOf(productId);
      if (pos !== -1) {
        return prev.filter((value, index) => index !== pos);
      }
      return prev;
    });
  }
  // TODO limpiar carrito de compras
  function clearCart() {
    setCartProducts([]);
  }

  return (
    <CartContext.Provider
      value={{
        cartProducts,
        setCartProducts,
        addProduct,
        removeProduct,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  );
}

