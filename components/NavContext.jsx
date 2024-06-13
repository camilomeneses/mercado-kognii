import React, { createContext, useState } from 'react';

export const NavContext = createContext();

export const NavContextProvider = ({ children }) => {
  const [mobileActiveNav, setMobileActiveNav] = useState(false);

  const toggleMobileActiveNav = () => {
    setMobileActiveNav((prev) => !prev);
  };

  const closeMobileNav = () => {
    setMobileActiveNav(false);
  };

  return (
    <NavContext.Provider
      value={{ mobileActiveNav, toggleMobileActiveNav, closeMobileNav }}>
      {children}
    </NavContext.Provider>
  );
};
