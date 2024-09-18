import React, { useState, useEffect } from 'react';
import tapImage from '../assets/icons/My_Coin.gif'; 
import './Tap.css'; // Import CSS for styling

function Tap() {
  const [balance, setBalance] = useState(() => {
    // Retrieve balance from localStorage, or initialize to 0 if not set
    const savedBalance = localStorage.getItem('balance');
    return savedBalance !== null ? parseFloat(savedBalance) : 0;
  });

  const [taps, setTaps] = useState(() => {
    // Optionally, you can store tap count too
    const savedTaps = localStorage.getItem('taps');
    return savedTaps !== null ? parseInt(savedTaps, 10) : 0;
  });

  useEffect(() => {
    // Save balance to localStorage whenever it changes
    localStorage.setItem('balance', balance.toFixed(3));
  }, [balance]);

  useEffect(() => {
    // Save tap count to localStorage whenever it changes
    localStorage.setItem('taps', taps);
  }, [taps]);

  const handleTap = () => {
    setBalance(prevBalance => prevBalance + 0.001); // Increment balance by 0.001
    setTaps(prevTaps => prevTaps + 1); // Increment tap count
    if (navigator.vibrate) {
      navigator.vibrate(100); // Vibrate for 100ms if supported
    }
  };

  return (
    <div className="tap-container">
      <h1>Luxurybot</h1>
          <div className="tap-image-container">
        <img
          src={tapImage}
          alt="Tap to increase balance"
          className="tap-image"
          onClick={handleTap}
        />
      </div>
      <p className='p'>Tap the Luxury Coin</p>
      <div className="balance-info">
        <p><strong>Current Balance:</strong></p>
        <p className='bal'>{balance.toFixed(3)} LXY</p>
        
        <p className='tapcount'>Tap Count: {taps}</p>
      </div>
    </div>
  );
}

export default Tap;
