import React, { createContext, useState, useContext, useEffect } from 'react';

const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('balance');
    return savedBalance ? parseFloat(savedBalance) : 0; // Ensure it's 0 if there's no saved balance
  });

  // This will update balance in both state and localStorage
  const addToBalance = (amount) => {
    setBalance((prevBalance) => {
      const newBalance = prevBalance + amount;
      // Store the updated balance in localStorage immediately
      localStorage.setItem('balance', newBalance.toFixed(3));
      return newBalance;
    });
  };

  return (
    <BalanceContext.Provider value={{ balance, addToBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => useContext(BalanceContext);
