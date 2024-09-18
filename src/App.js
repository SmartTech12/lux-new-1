import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { BalanceProvider } from './contexts/BalanceContext'; // Adjust the path as necessary
import Tap from './pages/Tap';
import Mine from './pages/Mine';
import Spin from './pages/Spin';
import Task from './pages/Task';

// Import your images
import tapImage from './assets/icons/coin.png'; // Adjust the path as necessary
import mineImage from './assets/icons/pickaxe.png'; // Adjust the path as necessary
import spinImage from './assets/icons/fortune-wheel.png'; // Adjust the path as necessary
import taskImage from './assets/icons/task-list.png'; // Adjust the path as necessary

function App() {
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
          <Route path="/" element={<Tap />} />
          <Route path="/mine" element={<Mine />} />
          <Route path="/spin" element={<Spin />} />
          <Route path="/task" element={<Task />} />
        </Routes>
      </Router>
    </BalanceProvider>
  );
}

export default App;
