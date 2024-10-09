import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, setDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Ensure both db and auth are imported
import './Task.css';

function Task() {
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [loading, setLoading] = useState(true); // Loading state
  const [submission, setSubmission] = useState(''); // State for user submission (link or image)
  const [selectedTaskId, setSelectedTaskId] = useState(''); // State for the selected task
  const user = auth.currentUser; // Get the currently signed-in user

  // Load tasks from Firestore
  const loadTasks = useCallback(async () => {
    if (user) {
      const userTasksCollection = collection(db, 'users', user.uid, 'tasks');
      const taskSnapshot = await getDocs(userTasksCollection);

      const taskList = taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(taskList);
    }
  }, [user]);

  // Add initial tasks if they don't already exist in Firestore
  const addInitialTasks = useCallback(async () => {
    if (!user) return; // Ensure user is authenticated

    const userTasksCollection = collection(db, 'users', user.uid, 'tasks');
    const taskDescriptions = [
      { description: 'Join our Telegram Group', link: 'https://t.me/LXYRWA2', details: '18pts' },
      { description: 'Join our X Community', link: 'https://x.com/LuxuryRWA?t=qAlhWAbiFsmTH-z-cdIVcA&s=09', details: '18pts' },
      { description: 'Join our Telegram Community', link: 'https://t.me/LXYRWA', details: '18pts.' },
      { description: 'Join Us On Instagram', link: 'https://www.instagram.com/lxyrwa?igsh=OGQ5ZDc2ODk2ZA==', details: '18pts' },
      { description: 'Subscribe To Our YouTube', link: 'https://youtu.be/_C242j_5l7I?si=tCVsTrfvOLZp2Jlj', details: '18pts' },
      { description: 'About us 1 on YouTube', link: 'https://youtu.be/SCtyovbuyOo?si=pdfqcfW_Zve0wnsK', details: '18pts' },
      { description: 'About us 2 on YouTube', link: 'https://youtu.be/_C242j_5l7I?si=tCVsTrfvOLZp2Jlj', details: '18pts' },
      { description: 'About us 3 on YouTube', link: 'https://youtu.be/PXVTr7twS58?si=jmUGxt8ctaBc6yUe', details: '18pts' },
      { description: 'QUOTE RETWEET OUR X POST WITH " Mine LXY with Me" And submit your post link below.', link: 'https://x.com/LuxuryRWA/status/1827692460564533254?t=J3Nvi72xhZA6PaMjIoh2qw&s=19', details: '30pts' },
    ];

    const taskPromises = taskDescriptions.map(async (task) => {
      // Use a unique document ID based on the description
      const taskDocRef = doc(userTasksCollection, task.description); 
      const taskSnapshot = await getDocs(query(userTasksCollection, where('description', '==', task.description)));

      // Only add the task if it doesn't already exist
      if (taskSnapshot.empty) {
        await setDoc(taskDocRef, {
          ...task,
          status: 'pending', // Initial status for new tasks
        });
      }
    });

    // Wait for all tasks to be added
    await Promise.all(taskPromises);
  }, [user]);

  // Initialize tasks when the component mounts
  useEffect(() => {
    const initTasks = async () => {
      if (user) {
        const userTasksCollection = collection(db, 'users', user.uid, 'tasks');
        const taskSnapshot = await getDocs(userTasksCollection);

        // Add initial tasks if the collection is empty
        if (taskSnapshot.empty) {
          await addInitialTasks(); // Add initial tasks if the collection is empty
        }

        // Load tasks after ensuring initial tasks are added
        await loadTasks();
        setLoading(false); // Stop loading
      }
    };

    initTasks();
  }, [user, loadTasks, addInitialTasks]); // Include loadTasks and addInitialTasks in the dependency array

  // Handle form submission for user submission (link or image)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submission) return; // Ensure user submits something
    if (!selectedTaskId) return; // Ensure a task is selected

    const taskDocRef = doc(db, 'users', user.uid, 'tasks', selectedTaskId); // Reference the task document
    await updateDoc(taskDocRef, { submission }); // Update the task with user submission

    // Send the submission (link or image) to the Telegram bot
    await sendTelegramMessage(user.email, `Submitted: ${submission}`);

    setSubmission(''); // Clear the input after submission
  };

  // Handle clicking the 'Go' button for tasks
  const handleGoClick = async (taskId, link) => {
    const task = tasks.find(task => task.id === taskId);
    if (task.status === 'completed' || task.status === 'verifying') return;

    window.open(link, '_blank'); // Open the link in a new tab

    const taskDocRef = doc(db, 'users', user.uid, 'tasks', taskId);
    await updateDoc(taskDocRef, { status: 'verifying' }); // Update status to verifying

    // Send message to the Telegram bot with the user's email
    await sendTelegramMessage(user.email, task.description);
  };

  // Send a message to the Telegram bot
  const sendTelegramMessage = async (email, messageContent) => {
    const botToken = '7692614203:AAF5FNuMB1omXlpJEp5-sdLB7QVfdihp814'; // Replace with your bot token
    const chatId = '6887844216'; // Replace with your chat ID

    const message = `User with email: ${email} - ${messageContent}`;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });
  };

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <div className='body2'>
      <div className="task-container">
        <h1>Tasks<p>Paste link below to verify task within 24hrs</p></h1>
        <ul className="task-list">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <li key={task.id} className={task.status}>
                <span>{task.description}</span>

                {/* Add task details below the description */}
                <p className="task-details">{task.details}</p> 

                {task.status === 'pending' && (
                  <button onClick={() => {
                    handleGoClick(task.id, task.link);
                    setSelectedTaskId(task.id); // Set selected task for user submission
                  }}>Go</button>
                )}
                {task.status === 'verifying' && <span> - Verifying...</span>}
                {task.status === 'completed' && <span> - Completed</span>}
                
                {/* Display the submission if the user has submitted something */}
                {task.submission && (
                  <div className="submission">
                    <span>Submission: {task.submission}</span>
                  </div>
                )}
              </li>
            ))
          ) : (
            <li>No tasks available</li>
          )}
        </ul>

        {/* Form for user to submit link or image */}
        <form className="submission-form" onSubmit={handleSubmit}>
          <label>
            Submit link or image:
            <input
              type="text"
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              placeholder="Enter link or image URL"
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Task;
