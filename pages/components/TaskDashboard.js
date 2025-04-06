import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './TaskDashboard.module.css';

const TaskDashboard = ({ userId, userType }) => {
  const [activeTab, setActiveTab] = useState('ongoing');
  const [tasks, setTasks] = useState({
    ongoing: [],
    disputes: [],
    completed: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        
        // The endpoint will be different based on user type
        const endpoint = userType === 'contractor' 
          ? `/api/contractors/${userId}/tasks` 
          : `/api/tradesman/${userId}/tasks`;
          
        const response = await axios.get(endpoint);
        
        if (response.data) {
          // Organize tasks by status
          const categorizedTasks = {
            ongoing: response.data.tasks.filter(task => task.status === 'ongoing' || task.status === 'assigned'),
            disputes: response.data.tasks.filter(task => task.status === 'dispute'),
            completed: response.data.tasks.filter(task => task.status === 'completed')
          };
          
          setTasks(categorizedTasks);
        }
      } catch (err) {
        setError('Failed to load tasks. Please try again.');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId, userType]);

  const getStatusBadge = (status) => {
    let className = '';
    let label = '';
    
    switch (status) {
      case 'ongoing':
      case 'assigned':
        className = styles.badgeBlue;
        label = 'Ongoing';
        break;
      case 'dispute':
        className = styles.badgeYellow;
        label = 'Dispute';
        break;
      case 'completed':
        className = styles.badgeGreen;
        label = 'Completed';
        break;
      default:
        className = styles.badgeGray;
        label = 'Unknown';
    }
    
    return <span className={`${styles.badge} ${className}`}>{label}</span>;
  };

  const renderTaskCard = (task) => {
    return (
      <div key={task.id} className={styles.taskCard}>
        <div className={styles.taskHeader}>
          <h3 className={styles.taskTitle}>{task.title}</h3>
          {getStatusBadge(task.status)}
        </div>
        
        <div className={styles.taskLocation}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>{task.location}</span>
        </div>
        
        <div className={styles.taskDetails}>
          <div className={styles.detailItem}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
            <span>Category: {task.category}</span>
          </div>
          
          <div className={styles.detailItem}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Deadline: {task.deadline}</span>
          </div>
          
          {task.estimated_days && (
            <div className={styles.detailItem}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Duration: {task.estimated_days} days</span>
            </div>
          )}
        </div>
        
        <p className={styles.taskDescription}>{task.description}</p>
        
        <div className={styles.taskFooter}>
          <div className={styles.taskBudget}>
            <p>Budget: ${task.budget}</p>
            {task.price_quote && <p>Quote: ${task.price_quote}</p>}
          </div>
          <button 
            className={styles.viewButton}
            onClick={() => window.location.href = `/tasks/${task.id}`}
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  const renderEmptyState = (type) => {
    const messages = {
      ongoing: "You don't have any ongoing tasks.",
      disputes: "You don't have any disputed tasks.",
      completed: "You don't have any completed tasks."
    };
    
    const getIcon = (type) => {
      if (type === 'ongoing') {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
        );
      } else if (type === 'disputes') {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      } else {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      }
    };
    
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIcon}>
          {getIcon(type)}
        </div>
        <p>{messages[type]}</p>
        {type === 'ongoing' && (
          <button 
            className={styles.actionButton}
            onClick={() => window.location.href = '/jobs'}
          >
            {userType === 'tradesman' ? 'Browse Available Jobs' : 'Post a New Job'}
          </button>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className={styles.loadingState}>Loading tasks...</div>;
  }

  if (error) {
    return <div className={styles.errorState}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>My Tasks</h1>
      
      <div className={styles.tabs}>
        <div className={styles.tabsList}>
          <button
            className={`${styles.tab} ${activeTab === 'ongoing' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('ongoing')}
          >
            Ongoing
            {tasks.ongoing.length > 0 && (
              <span className={styles.tabCount}>{tasks.ongoing.length}</span>
            )}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'disputes' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('disputes')}
          >
            Disputes
            {tasks.disputes.length > 0 && (
              <span className={styles.tabCount}>{tasks.disputes.length}</span>
            )}
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'completed' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
            {tasks.completed.length > 0 && (
              <span className={styles.tabCount}>{tasks.completed.length}</span>
            )}
          </button>
        </div>
        
        <div className={styles.tabContent}>
          {activeTab === 'ongoing' && (
            <div>
              {tasks.ongoing.length > 0 ? (
                tasks.ongoing.map(task => renderTaskCard(task))
              ) : (
                renderEmptyState('ongoing')
              )}
            </div>
          )}
          
          {activeTab === 'disputes' && (
            <div>
              {tasks.disputes.length > 0 ? (
                tasks.disputes.map(task => renderTaskCard(task))
              ) : (
                renderEmptyState('disputes')
              )}
            </div>
          )}
          
          {activeTab === 'completed' && (
            <div>
              {tasks.completed.length > 0 ? (
                tasks.completed.map(task => renderTaskCard(task))
              ) : (
                renderEmptyState('completed')
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;