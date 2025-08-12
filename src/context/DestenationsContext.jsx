import React, { createContext, useContext, useEffect, useState } from 'react';

const DestinationContext = createContext();

export const DestinationProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(null);

  // Load from sessionStorage on initial render
  useEffect(() => {
    const storedCity = sessionStorage.getItem('selectedCity');
    if (storedCity) {
      setSelectedCity(JSON.parse(storedCity));
    }
  }, []);

  // Save to sessionStorage whenever selectedCity changes
  useEffect(() => {
    if (selectedCity) {
      sessionStorage.setItem('selectedCity', JSON.stringify(selectedCity));
    } else {
      sessionStorage.removeItem('selectedCity');
    }
  }, [selectedCity]);

  return (
    <DestinationContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </DestinationContext.Provider>
  );
};

export const useDestination = () => {
  return useContext(DestinationContext);
};