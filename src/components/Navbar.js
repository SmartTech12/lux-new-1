import React from 'react';
import { Link } from 'react-router-dom';
import TapIcon from '../assets/icons/coin.png';
import MineIcon from '../assets/icons/pickaxe.png';
import TaskIcon from '../assets/icons/task-list.png';
import SpinIcon from '../assets/icons/fortune-wheel.png';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">
            <img src={TapIcon} alt="Tap" />
            Tap
          </Link>
        </li>
        <li>
          <Link to="/mine">
            <img src={MineIcon} alt="Mine" />
            Mine
          </Link>
        </li>
        <li>
          <Link to="/task">
            <img src={TaskIcon} alt="Task" />
            Task
          </Link>
        </li>
        <li>
          <Link to="/spin">
            <img src={SpinIcon} alt="Spin" />
            Spin
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
