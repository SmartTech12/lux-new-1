import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { BalanceProvider } from './contexts/BalanceContext';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './firebase';
import Tap from './pages/Tap';
import Mine from './pages/Mine';
import Spin from './pages/Spin';
import Task from './pages/Task';
import SignUp from './pages/SignUp'; // New Signup page

import tapImage from './assets/icons/coin.png';
import mineImage from './assets/icons/pickaxe.png';
import spinImage from './assets/icons/fortune-wheel.png';
import taskImage from './assets/icons/task-list.png';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // If user is signed in, redirect them to home, no login/logout allowed
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/signup" />;
    }
    return children;
  };

  return (
    <BalanceProvider>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">
                <img src={tapImage} alt="Tap" className="nav-icon" />
                Tap
              </Link>
            </li>
            <li>
              <Link to="/mine">
                <img src={mineImage} alt="Mine" className="nav-icon" />
                Mine
              </Link>
            </li>
            <li>
              <Link to="/spin">
                <img src={spinImage} alt="Spin" className="nav-icon" />
                Spin
              </Link>
            </li>
            <li>
              <Link to="/task">
                <img src={taskImage} alt="Task" className="nav-icon" />
                Task
              </Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Tap /></ProtectedRoute>} />
          <Route path="/mine" element={<ProtectedRoute><Mine /></ProtectedRoute>} />
          <Route path="/spin" element={<ProtectedRoute><Spin /></ProtectedRoute>} />
          <Route path="/task" element={<ProtectedRoute><Task /></ProtectedRoute>} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </BalanceProvider>
  );
}

export default App;
