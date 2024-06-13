import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettingsContext = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const ls = typeof window !== 'undefined' ? window.localStorage : null;
  const [telephones, setTelephones] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [logo, setLogo] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationNit, setOrganizationNit] = useState('');
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    if (ls) {
      const cachedSocialLinks = ls.getItem('socialLinks');
      const cachedTelephones = ls.getItem('telephones');
      const cachedAddresses = ls.getItem('addresses');
      const cachedEmails = ls.getItem('emails');

      if (cachedSocialLinks) {
        setSocialLinks(JSON.parse(cachedSocialLinks));
      }
      if (cachedTelephones) {
        setTelephones(JSON.parse(cachedTelephones));
      }
      if (cachedAddresses) {
        setAddresses(JSON.parse(cachedAddresses));
      }
      if (cachedEmails) {
        setEmails(JSON.parse(cachedEmails));
      }
    }
  }, [ls]);

  //! aux function
  const updateStateFromCache = (key, stateSetter) => {
    const cachedValue = ls.getItem(key);
    stateSetter(JSON.parse(cachedValue));
  };

  //? cached
  const updateSocialLinks = (links) => {
    const hashMapSocialLinks = links.reduce((map, obj) => {
      map[obj.name] = {
        value: obj.value[0],
        authorized: obj.authorized,
      };
      return map;
    }, {});

    if (
      ls &&
      ls.getItem('socialLinks') &&
      ls.getItem('socialLinks') === JSON.stringify(hashMapSocialLinks)
    ) {
      updateStateFromCache('socialLinks', setSocialLinks);
    } else {
      ls.setItem('socialLinks', JSON.stringify(hashMapSocialLinks));
      updateStateFromCache('socialLinks', setSocialLinks);
    }
  };

  //! aux function
  const updateValueWithCache = (key, value, stateSetter) => {
    if (ls && ls.getItem(key) && ls.getItem(key) === JSON.stringify(value)) {
      const cachedValue = ls.getItem(key);
      stateSetter(JSON.parse(cachedValue));
    } else {
      ls.setItem(key, JSON.stringify(value));
      const cachedValue = ls.getItem(key);
      stateSetter(JSON.parse(cachedValue));
    }
  };

  //? cached
  const updateTelephones = (telephonesValues) => {
    updateValueWithCache('telephones', telephonesValues?.value, setTelephones);
  };

  //? cached
  const updateAddresses = (addressesValues) => {
    updateValueWithCache('addresses', addressesValues?.value, setAddresses);
  };

  //? cached
  const updateEmails = (emailsValues) => {
    updateValueWithCache('emails', emailsValues?.value, setEmails);
  };

  const updateLogo = (logo) => {
    setLogo(logo);
  };

  const updateOrganizationName = (name) => {
    setOrganizationName(name);
  };

  const updateOrganizationNit = (nit) => {
    setOrganizationNit(nit);
  };

  const contextValues = {
    //* variables
    telephones,
    addresses,
    socialLinks,
    emails,
    organizationName,
    organizationNit,
    logo,

    //* functions
    updateSocialLinks,
    updateTelephones,
    updateAddresses,
    updateEmails,
    updateLogo,
    updateOrganizationName,
    updateOrganizationNit,
  };

  return (
    <SettingsContext.Provider value={contextValues}>
      {children}
    </SettingsContext.Provider>
  );
};

