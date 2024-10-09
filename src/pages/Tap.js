import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'; // Firestore functions
import { db, auth } from '../firebase'; // Ensure Firestore and Auth are imported
import tapImage from '../assets/icons/My_Coin.gif'; 
import './Tap.css'; // Import your styling

function Tap() {
  // Retrieve balance and taps from localStorage initially
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('balance');
    return savedBalance !== null ? parseFloat(savedBalance) : 0;
  });

  const [taps, setTaps] = useState(() => {
    const savedTaps = localStorage.getItem('taps');
    return savedTaps !== null ? parseInt(savedTaps, 10) : 0;
  });

  const [loading, setLoading] = useState(true); // Track loading state
  const user = auth.currentUser; // Get the authenticated user

  // Function to load user data (balance & taps) from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid); // Reference the user's document in Firestore
        const userDocSnap = await getDoc(userDocRef); // Get the document snapshot

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const firestoreBalance = Number(userData.balance) || 0;
          const firestoreTaps = Number(userData.taps) || 0;

          // Sync Firestore data with localStorage data if Firestore has higher values
          if (firestoreBalance > balance || firestoreTaps > taps) {
            setBalance(firestoreBalance);
            setTaps(firestoreTaps);
          } else {
            // If localStorage has higher values, update Firestore
            await updateDoc(userDocRef, {
              balance: balance.toFixed(3), // Save balance from localStorage if higher
              taps: taps, // Save taps from localStorage if higher
            });
          }
        } else {
          // If no document exists, create one with the values from localStorage or default
          await setDoc(userDocRef, { balance: balance.toFixed(3), taps: taps });
        }

        setLoading(false); // Stop loading after fetching data
      }
    };

    loadUserData();
  }, [user, balance, taps]); // Add balance and taps as dependencies

  // Save balance and taps to Firestore whenever they change
  useEffect(() => {
    if (user && !loading) {
      const saveToFirestore = async () => {
        const userDocRef = doc(db, 'users', user.uid); // Reference user's document
        await updateDoc(userDocRef, {
          balance: balance.toFixed(3), // Save balance with 3 decimal places
          taps: taps, // Save tap count
        });
      };

      saveToFirestore(); // Call the function to save data
    }

    // Save to localStorage whenever balance or taps change
    localStorage.setItem('balance', balance.toFixed(3));
    localStorage.setItem('taps', taps);
  }, [balance, taps, user, loading]); // Save data when balance, taps, or user changes

  // Handle tapping action
  const handleTap = () => {
    const newBalance = (Number(balance) || 0) + 0.001; // Increment balance by 0.001
    const newTaps = (Number(taps) || 0) + 1; // Increment tap count
    setBalance(newBalance); // Update the balance state
    setTaps(newTaps); // Update the tap count state

    // Vibration feedback if supported
    if (navigator.vibrate) {
      navigator.vibrate(100); // Vibrate for 100ms if supported
    }
  };

  if (loading) {
    return <p>Loading your data...</p>; // Show loading state
  }

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
        <p className='bal'>{Number(balance).toFixed(3)} LXY</p> {/* Ensure balance is a number */}
        <p className='tapcount'>Tap Count: {taps}</p>
      </div>
    </div>
  );
}

export default Tap;
