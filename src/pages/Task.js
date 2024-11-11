import React, { useState, useEffect } from 'react';
import { useBalance } from '../contexts/BalanceContext';
import './Task.css';

function Task() {
  const { balance, addToBalance } = useBalance(); // Use balance and addToBalance from context
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('In-Game');

  useEffect(() => {
    const initTasks = () => {
      const inGameTasks = [
        { id: 1, description: 'Join our Telegram Group', link: 'https://t.me/LXYRWA2', category: 'In-Game', status: 'pending' },
        { id: 2, description: 'Join our X Community', link: 'https://x.com/LuxuryRWA?t=qAlhWAbiFsmTH-z-cdIVcA&s=09', category: 'In-Game', status: 'pending' },
      ];
      const youtubeTasks = [
        { id: 3, description: 'Subscribe to our YouTube Channel', link: 'https://youtube.com', category: 'YouTube Videos', status: 'pending' },
      ];

      setTasks([...inGameTasks, ...youtubeTasks]);
      setLoading(false);
    };

    initTasks();
  }, []);

  // Check if the task was completed before (on refresh)
  useEffect(() => {
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    setTasks(prevTasks => 
      prevTasks.map(task => completedTasks.includes(task.id) ? { ...task, status: 'completed' } : task)
    );
  }, []);

  const handleGoClick = (taskId, link, category) => {
    // Open the task link
    window.open(link, '_blank');

    // Update the task status to 'verifying' or 'completed'
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'verifying' } : t));

    if (category === 'In-Game') {
      setTimeout(() => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t));
        addToBalance(6); // Add 6 LXY to the balance

        // Store the completed task in localStorage
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
        localStorage.setItem('completedTasks', JSON.stringify([...completedTasks, taskId]));

        // Update the balance in localStorage immediately to persist across refreshes
        localStorage.setItem('balance', (balance + 6).toFixed(3));
      }, 5000); // Simulate the 5 seconds delay for completion
    } else {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t));
      addToBalance(6); // Add 6 LXY to the balance

      const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
      localStorage.setItem('completedTasks', JSON.stringify([...completedTasks, taskId]));

      localStorage.setItem('balance', (balance + 6).toFixed(3)); // Update balance in localStorage
    }
  };

  if (loading) return <div className="load">Loading...</div>;

  return (
    <div className="task-container">
      <h1>Tasks</h1>
      <div className="tabs">
        <button onClick={() => setSelectedCategory('In-Game')} className={selectedCategory === 'In-Game' ? 'active' : ''}>
          In-Game
        </button>
        <button onClick={() => setSelectedCategory('YouTube Videos')} className={selectedCategory === 'YouTube Videos' ? 'active' : ''}>
          YouTube Videos
        </button>
      </div>

      <div className="task-list">
        {tasks.filter(task => task.category === selectedCategory).map(task => (
          <div key={task.id} className={`task-item ${task.status}`}>
            <span>{task.description}</span>
            {task.status === 'pending' && (
              <button onClick={() => handleGoClick(task.id, task.link, task.category)}>Go</button>
            )}
            {task.status === 'verifying' && <span> - Verifying...</span>}
            {task.status === 'completed' && <span> - Completed</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Task;
