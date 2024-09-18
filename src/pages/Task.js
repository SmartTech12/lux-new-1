import React, { useState, useEffect } from 'react';
import './Task.css';

function Task() {
  // Load tasks from localStorage or use initial task list
  const [tasks, setTasks] = useState(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    return savedTasks || [
      { id: 1, description: 'Join our Telegram Group', link: 'https://t.me/LXYRWA2', status: 'pending', timer: null },
      { id: 2, description: 'Join our X Community', link: 'https://x.com/LuxuryRWA?t=qAlhWAbiFsmTH-z-cdIVcA&s=09', status: 'pending', timer: null },
      { id: 3, description: 'Join our Telegram Channel', link: 'https://t.me/LXYRWA', status: 'pending', timer: null },
    ];
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleGoClick = (taskId, link) => {
    const task = tasks.find(task => task.id === taskId);
    if (task.status === 'completed' || task.status === 'verifying') return; // Prevent action if already completed or verifying

    window.open(link, '_blank');
    
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId && task.status === 'pending') {
        // Set task to verifying and start a 30-second timer
        return { 
          ...task, 
          status: 'verifying', 
          timer: setTimeout(() => markTaskCompleted(taskId), 2000) // 30-second delay
        };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const markTaskCompleted = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: 'completed', timer: null } : task
    );
    setTasks(updatedTasks);

    // Update the user's balance by adding 18 points
    const currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
    const newBalance = currentBalance + 18;
    localStorage.setItem('balance', newBalance.toFixed(3));

    // Trigger a balance update
    window.dispatchEvent(new Event('balanceUpdated'));
  };

  return (
    <div className='body2'>
         <div className="task-container">
      <h1>Tasks<p>To verify task, Have to wait on the site for 10sec</p></h1>
      
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.status}>
            <span>{task.description}</span>
            {task.status === 'pending' && (
              <button onClick={() => handleGoClick(task.id, task.link)}>Go</button>
            )}
            {task.status === 'verifying' && <span> - Verifying...</span>}
            {task.status === 'completed' && <span> - Completed</span>}
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default Task;
