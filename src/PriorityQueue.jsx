import React, { useState, useEffect } from 'react';
import './PriorityQueue.css';

const PriorityQueue = () => {
  // ===== QUEUE STATE =====
  const [queue, setQueue] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // ===== PRIORITY ORDER =====
  const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };

  // ===== ADD EMERGENCY =====
  const addEmergency = (location, description, priority) => {
    const newEmergency = {
      id: Date.now(),
      location,
      description,
      priority,
      timestamp: new Date().toLocaleTimeString(),
      status: 'Pending'
    };
    setQueue(prev => [...prev, newEmergency].sort((a, b) => 
      priorityOrder[a.priority] - priorityOrder[b.priority]
    ));
  };

  // ===== PROCESS QUEUE =====
  const processQueue = () => {
    if (queue.length === 0 || processing) return;
    
    setProcessing(true);
    const next = queue[0];
    setCurrentItem(next);
    
    // Update status
    setQueue(prev => prev.map((item, index) =>
      index === 0 ? { ...item, status: 'Processing' } : item
    ));

    // Simulate processing time based on priority
    const timeMap = { Critical: 3000, High: 2000, Medium: 1500, Low: 1000 };
    const delay = timeMap[next.priority] || 1500;

    setTimeout(() => {
      // Remove processed item
      setQueue(prev => prev.slice(1));
      setCurrentItem(null);
      setProcessing(false);
      
      // Auto-process next
      setTimeout(() => processQueue(), 500);
    }, delay);
  };

  // ===== AUTO PROCESS =====
  useEffect(() => {
    if (queue.length > 0 && !processing) {
      processQueue();
    }
  }, [queue]);

  // ===== GET PRIORITY COLOR =====
  const getPriorityColor = (priority) => {
    const colors = {
      Critical: '#ef4444',
      High: '#f97316',
      Medium: '#eab308',
      Low: '#22c55e'
    };
    return colors[priority] || '#8ab4f8';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      Critical: '🚨 Critical',
      High: '🔥 High',
      Medium: '⚠️ Medium',
      Low: 'ℹ️ Low'
    };
    return badges[priority] || priority;
  };

  return (
    <div className="pq-container">
      <div className="pq-header">
        <h2>🔥 Priority Queue - Emergency System</h2>
        <p>Critical → High → Medium → Low</p>
      </div>

      {/* ===== ADD EMERGENCY FORM ===== */}
      <div className="pq-form">
        <h3>🚨 Add Emergency Request</h3>
        <div className="pq-form-row">
          <input 
            type="text" 
            placeholder="📍 Location" 
            id="pq-location"
            className="pq-input"
          />
          <input 
            type="text" 
            placeholder="📝 Description" 
            id="pq-description"
            className="pq-input"
          />
          <select id="pq-priority" className="pq-select">
            <option value="Critical">🚨 Critical</option>
            <option value="High">🔥 High</option>
            <option value="Medium">⚠️ Medium</option>
            <option value="Low">ℹ️ Low</option>
          </select>
          <button 
            className="pq-add-btn"
            onClick={() => {
              const location = document.getElementById('pq-location').value;
              const description = document.getElementById('pq-description').value;
              const priority = document.getElementById('pq-priority').value;
              if (location && description) {
                addEmergency(location, description, priority);
                document.getElementById('pq-location').value = '';
                document.getElementById('pq-description').value = '';
              } else {
                alert('Please fill all fields!');
              }
            }}
          >
            ➕ Add to Queue
          </button>
        </div>
      </div>

      {/* ===== CURRENT PROCESSING ===== */}
      {currentItem && (
        <div className="pq-current">
          <h4>🔄 Currently Processing</h4>
          <div className="pq-current-card" style={{ borderColor: getPriorityColor(currentItem.priority) }}>
            <div className="pq-current-info">
              <span className="pq-current-priority" style={{ color: getPriorityColor(currentItem.priority) }}>
                {getPriorityBadge(currentItem.priority)}
              </span>
              <span className="pq-current-location">📍 {currentItem.location}</span>
              <span className="pq-current-desc">{currentItem.description}</span>
              <span className="pq-current-time">⏱️ {currentItem.timestamp}</span>
            </div>
            <div className="pq-current-progress">
              <div className="pq-progress-bar">
                <div className="pq-progress-fill" style={{ 
                  width: '100%', 
                  background: `linear-gradient(90deg, ${getPriorityColor(currentItem.priority)}, #0d6efd)` 
                }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== QUEUE LIST ===== */}
      <div className="pq-queue-list">
        <div className="pq-queue-header">
          <h4>📋 Emergency Queue</h4>
          <span className="pq-queue-count">{queue.length} pending</span>
        </div>

        {queue.length === 0 ? (
          <div className="pq-empty">
            <span>✅ Queue is empty</span>
            <p>All emergencies have been processed!</p>
          </div>
        ) : (
          queue.map((item, index) => (
            <div 
              key={item.id} 
              className={`pq-queue-item ${item.status === 'Processing' ? 'processing' : ''}`}
              style={{ borderLeftColor: getPriorityColor(item.priority) }}
            >
              <div className="pq-item-rank">#{index + 1}</div>
              <div className="pq-item-info">
                <span className="pq-item-priority" style={{ color: getPriorityColor(item.priority) }}>
                  {getPriorityBadge(item.priority)}
                </span>
                <span className="pq-item-location">📍 {item.location}</span>
                <span className="pq-item-desc">{item.description}</span>
              </div>
              <div className="pq-item-status">
                <span className={`pq-status-badge ${item.status.toLowerCase()}`}>
                  {item.status === 'Processing' ? '⏳' : '⏰'} {item.status}
                </span>
                <span className="pq-item-time">{item.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PriorityQueue;