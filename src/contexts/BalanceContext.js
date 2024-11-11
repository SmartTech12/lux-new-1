import React, { createContext, useState, useContext, useEffect } from 'react';

const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('balance');
    return savedBalance ? parseFloat(savedBalance) : 0;
  });

  useEffect(() => {
    localStorage.setItem('balance', balance);
  }, [balance]);

  const addToBalance = (amount) => {
    setBalance((prevBalance) => prevBalance + amount);
  };

  return (
    <BalanceContext.Provider value={{ balance, addToBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => useContext(BalanceContext);
