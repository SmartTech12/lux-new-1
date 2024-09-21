import React, { useState, useEffect } from 'react';
import { useBalance } from '../contexts/BalanceContext';
import coin from '../assets/icons/clock (1).png';
import con from '../assets/icons/1726364941689.png'
import './Mine.css';

const MINE_DURATION = 9 * 60 * 60 * 1000; // 1 minute in milliseconds
const CLAIM_AMOUNT = 18;

const Mine = () => {
  const { addToBalance } = useBalance();
  const [timeRemaining, setTimeRemaining] = useState(MINE_DURATION);
  const [miningStarted, setMiningStarted] = useState(false);
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('mineData'));
    if (storedData) {
      const { startTime, miningComplete } = storedData;
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - startTime;

      if (miningComplete) {
        setCanClaim(true);
        setTimeRemaining(0);
      } else if (elapsedTime < MINE_DURATION) {
        setTimeRemaining(MINE_DURATION - elapsedTime);
        setMiningStarted(true);
      } else {
        setCanClaim(true);
        localStorage.setItem('mineData', JSON.stringify({ ...storedData, miningComplete: true }));
      }
    }
  }, []);

  useEffect(() => {
    if (miningStarted && !canClaim) {
      const intervalId = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 0) {
            clearInterval(intervalId);
            setCanClaim(true);
            localStorage.setItem('mineData', JSON.stringify({ ...JSON.parse(localStorage.getItem('mineData')), miningComplete: true }));
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [miningStarted, canClaim]);

  const handleStartMining = () => {
    const currentTime = new Date().getTime();
    localStorage.setItem('mineData', JSON.stringify({ startTime: currentTime, miningComplete: false }));
    setMiningStarted(true);
    setCanClaim(false);
    setTimeRemaining(MINE_DURATION);
  };

  const handleClaim = () => {
    if (canClaim) {
      addToBalance(CLAIM_AMOUNT);
      localStorage.removeItem('mineData'); // Clear data after claiming
      setTimeRemaining(MINE_DURATION); // Reset timer
      setMiningStarted(false);
      setCanClaim(false);
    }
  };

  const formatTime = (milliseconds) => {
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  return (
    <div className="mine-container">
      <h1 className='h2'>Mine LXY Token</h1>
      <p className='l'>Level up with mining.</p>
      <p className='no'>Claim LXY and keep the mining site active!</p>
      <span>
      <img
          src={con}
          alt="Tap to increase balance"
          className="con"
        />
      </span>
      <div className="timer">
        <span className='time'><img
          src={coin}
          alt="Tap to increase balance"
          className="coin"
        />
           Time Remaining: <p className='sec'>{formatTime(timeRemaining)}</p></span>
        <button className='button' onClick={handleStartMining} disabled={miningStarted || canClaim}>
          Start Mining
        </button>
        
        <button className='button' onClick={handleClaim} disabled={!canClaim}>
          Claim Token
        </button>
      </div>
    </div>
  );
};

export default Mine;
