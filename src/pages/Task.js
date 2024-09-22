import React, { useState, useEffect, useMemo } from 'react';
import './Task.css';

function Task() {
  // Memoize the initial tasks array
  const initialTasks = useMemo(() => [
    { id: 1, description: 'Join our Telegram Group', link: 'https://t.me/LXYRWA2', status: 'pending', timer: null },
    { id: 2, description: 'Join our X Community', link: 'https://x.com/LuxuryRWA?t=qAlhWAbiFsmTH-z-cdIVcA&s=09', status: 'pending', timer: null },
    { id: 3, description: 'Join our Telegram Channel', link: 'https://t.me/LXYRWA', status: 'pending', timer: null },
    { id: 4, description: 'Join our Youtube community', link: 'https://youtube.com/@lxyrwa?si=qAdyYj654Fsbqf0s', status: 'pending', timer: null },
    // Add your new task here
    { id: 5, description: 'Follo our Instagram', link: 'https://instagram.com/luxuryRWA', status: 'pending', timer: null }
  ], []);

  // Merge new tasks with existing ones in localStorage
  const mergeTasks = (savedTasks, newTasks) => {
    const mergedTasks = [...savedTasks];
    newTasks.forEach((newTask) => {
      if (!savedTasks.some((task) => task.id === newTask.id)) {
        mergedTasks.push(newTask);
      }
    });
    return mergedTasks;
  };

  // Load tasks from localStorage and merge with initial tasks
  const [tasks, setTasks] = useState(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return mergeTasks(savedTasks, initialTasks);
  });

  // Update localStorage when tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleGoClick = (taskId, link) => {
    const task = tasks.find((task) => task.id === taskId);
    if (task.status === 'completed' || task.status === 'verifying') return;

    window.open(link, '_blank');

    const updatedTasks = tasks.map((task) =>
      task.id === taskId && task.status === 'pending'
        ? { ...task, status: 'verifying', timer: setTimeout(() => markTaskCompleted(taskId), 2000) }
        : task
    );
    setTasks(updatedTasks);
  };

  const markTaskCompleted = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: 'completed', timer: null } : task
    );
    setTasks(updatedTasks);

    // Update balance
    const currentBalance = parseFloat(localStorage.getItem('balance')) || 0;
    const newBalance = currentBalance + 18;
    localStorage.setItem('balance', newBalance.toFixed(3));

    // Trigger balance update
    window.dispatchEvent(new Event('balanceUpdated'));
  };

  return (
    <div className='body2'>
      <div className="task-container">
        <h1>Tasks<p>To verify the task, you must wait on the site for 10 seconds</p></h1>

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
