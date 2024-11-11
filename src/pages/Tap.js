import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import tapImage from '../assets/icons/My_Coin.gif';
import load from '../assets/icons/Diamond Neon Modern Phone Wallpaper_20240806_013134_0001.gif';
import './Tap.css';

function Tap() {
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('balance');
    return savedBalance !== null ? parseFloat(savedBalance) : 0;
  });

  const [loading, setLoading] = useState(true);
  const [isAirdropPopupVisible, setAirdropPopupVisible] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const loadUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const firestoreBalance = Number(userData.balance) || 0;

          if (firestoreBalance > balance) {
            setBalance(firestoreBalance);
          } else {
            await updateDoc(userDocRef, { balance: balance.toFixed(3) });
          }
        } else {
          await setDoc(userDocRef, { balance: balance.toFixed(3) });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
      setLoading(false);
    };

    loadUserData();
  }, [user, balance]);

  useEffect(() => {
    if (balance !== parseFloat(localStorage.getItem('balance'))) {
      localStorage.setItem('balance', balance.toFixed(3));
    }
    if (user && !loading) {
      const saveToFirestore = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { balance: balance.toFixed(3) });
      };
      saveToFirestore();
    }
  }, [balance, user, loading]);

  const handleAirdropClick = () => setAirdropPopupVisible(true);
  const closePopup = () => setAirdropPopupVisible(false);

  if (loading) return <div className='load'><img src={load} alt='' /></div>;

  return (
    <div className="tap-container">
      <h1 className="top-right-title">Luxurybot</h1>
      <div className="balance-container">
        <p className="main-balance-title">Current Balance:</p>
        <p className="balance">{Number(balance).toFixed(3)} LXY</p>
      </div>
      <div className="tap-image-container">
        <img
          src={tapImage}
          alt="Luxury Coin"
          className="tap-image"
        />
      </div>
      <button className="airdrop-button" onClick={handleAirdropClick}>Airdrop</button>

      {isAirdropPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Coming Soon</p>
            <button className="close-popup" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tap;
