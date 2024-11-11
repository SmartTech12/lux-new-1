import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { BalanceProvider } from './contexts/BalanceContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Tap from './pages/Tap';
import Task from './pages/Task';
import SignUp from './pages/SignUp';
import tapImage from './assets/icons/coin.png';
import taskImage from './assets/icons/task-list.png';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  // Protected route component to redirect unauthenticated users to SignUp
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
              <Link to="/task">
                <img src={taskImage} alt="Task" className="nav-icon" />
                Task
              </Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Tap /></ProtectedRoute>} />
          <Route path="/task" element={<ProtectedRoute><Task /></ProtectedRoute>} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </BalanceProvider>
  );
}

export default App;
