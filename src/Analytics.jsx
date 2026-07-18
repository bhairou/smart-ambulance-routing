import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [counters, setCounters] = useState({
    emergencies: 0,
    response: 0,
    completion: 0,
    trips: 0
  });
  const [showCharts, setShowCharts] = useState(false);

  useEffect(() => {
    const target = { emergencies: 89, response: 3.4, completion: 94, trips: 156 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      setCounters({
        emergencies: Math.floor(progress * target.emergencies),
        response: (progress * target.response).toFixed(1),
        completion: Math.floor(progress * target.completion),
        trips: Math.floor(progress * target.trips)
      });
      if (current >= steps) {
        setCounters({
          emergencies: target.emergencies,
          response: target.response,
          completion: target.completion,
          trips: target.trips
        });
        clearInterval(timer);
        setShowCharts(true);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const responseData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Response Time (min)',
      data: [4.2, 3.8, 3.5, 4.0, 3.2, 2.9, 3.1],
      borderColor: '#0d6efd',
      backgroundColor: 'rgba(13, 110, 253, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#0d6efd',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 10,
    }]
  };

  const emergencyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Emergency Calls',
      data: [12, 18, 9, 15, 22, 8, 5],
      backgroundColor: 'rgba(13, 110, 253, 0.7)',
      borderColor: '#0d6efd',
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  const statusData = {
    labels: ['Available', 'On Route', 'Busy'],
    datasets: [{
      data: [3, 2, 1],
      backgroundColor: ['rgba(74, 222, 128, 0.8)', 'rgba(251, 191, 36, 0.8)', 'rgba(248, 113, 113, 0.8)'],
      borderColor: ['#22c55e', '#eab308', '#ef4444'],
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    animation: { duration: 1500, easing: 'easeInOutQuart' },
    plugins: {
      legend: {
        labels: { color: '#8ab4f8', font: { size: 12, weight: '600' } }
      }
    },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#4a5a7a' } },
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#4a5a7a' } }
    }
  };

  const doughnutOptions = {
    responsive: true,
    animation: { duration: 2000, easing: 'easeInOutBounce' },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#8ab4f8', font: { size: 12, weight: '600' }, padding: 16 }
      }
    }
  };

  return (
    <div className="analytics-container">
      <div className="analytics-glass-header">
        <div className="header-glow"></div>
        <div className="header-content-animated">
          <h2>📊 Analytics Dashboard</h2>
          <p>Real-time performance insights <span className="live-dot-animated">●</span></p>
        </div>
      </div>

      <div className="analytics-stats-3d">
        <div className="stat-card-3d" style={{ '--delay': '0s' }}>
          <div className="card-inner">
            <div className="card-front">
              <div className="stat-icon-3d">📞</div>
              <h4>Total Emergencies</h4>
              <p className="stat-number-3d">{counters.emergencies}</p>
              <span className="stat-change-3d up">↑ 12%</span>
            </div>
            <div className="card-back">
              <p>📈 +12% from last month</p>
              <p>🔥 Peak: Friday (22 calls)</p>
            </div>
          </div>
        </div>

        <div className="stat-card-3d" style={{ '--delay': '0.15s' }}>
          <div className="card-inner">
            <div className="card-front">
              <div className="stat-icon-3d">⏱️</div>
              <h4>Avg Response</h4>
              <p className="stat-number-3d">{counters.response} min</p>
              <span className="stat-change-3d up">↓ 0.6 min</span>
            </div>
            <div className="card-back">
              <p>🎯 Target: 3.0 min</p>
              <p>✅ Improved by 15%</p>
            </div>
          </div>
        </div>

        <div className="stat-card-3d" style={{ '--delay': '0.3s' }}>
          <div className="card-inner">
            <div className="card-front">
              <div className="stat-icon-3d">✅</div>
              <h4>Completion Rate</h4>
              <p className="stat-number-3d">{counters.completion}%</p>
              <span className="stat-change-3d up">↑ 3%</span>
            </div>
            <div className="card-back">
              <p>🏆 Excellence Award</p>
              <p>📊 156 successful trips</p>
            </div>
          </div>
        </div>

        <div className="stat-card-3d" style={{ '--delay': '0.45s' }}>
          <div className="card-inner">
            <div className="card-front">
              <div className="stat-icon-3d">🚑</div>
              <h4>Total Trips</h4>
              <p className="stat-number-3d">{counters.trips}</p>
              <span className="stat-change-3d up">↑ 8%</span>
            </div>
            <div className="card-back">
              <p>📅 156 trips this month</p>
              <p>🚀 8% growth rate</p>
            </div>
          </div>
        </div>
      </div>

      {showCharts && (
        <div className="charts-grid-animated">
          <div className="chart-card-glass" style={{ '--delay': '0.5s' }}>
            <div className="chart-header-glass">
              <h4>📈 Response Time Trends</h4>
              <span className="chart-badge-glass">This Week</span>
            </div>
            <Line data={responseData} options={chartOptions} />
          </div>

          <div className="chart-card-glass" style={{ '--delay': '0.7s' }}>
            <div className="chart-header-glass">
              <h4>🚨 Daily Emergencies</h4>
              <span className="chart-badge-glass">This Week</span>
            </div>
            <Bar data={emergencyData} options={chartOptions} />
          </div>

          <div className="chart-card-glass" style={{ '--delay': '0.9s' }}>
            <div className="chart-header-glass">
              <h4>🚑 Ambulance Status</h4>
              <span className="chart-badge-glass live">Live</span>
            </div>
            <div className="doughnut-wrapper-glass">
              <Doughnut data={statusData} options={doughnutOptions} />
            </div>
          </div>

          <div className="chart-card-glass" style={{ '--delay': '1.1s' }}>
            <div className="chart-header-glass">
              <h4>📊 Performance Summary</h4>
              <span className="chart-badge-glass">Monthly</span>
            </div>
            <div className="performance-list-glass">
              <div className="perf-item-glass">
                <span>⚡ Peak Hour Response</span>
                <span className="perf-value-glass green">2.8 min</span>
              </div>
              <div className="perf-item-glass">
                <span>🌙 Off-Peak Response</span>
                <span className="perf-value-glass green">4.2 min</span>
              </div>
              <div className="perf-item-glass">
                <span>📅 Busiest Day</span>
                <span className="perf-value-glass">Friday</span>
              </div>
              <div className="perf-item-glass">
                <span>🏆 Most Active Ambulance</span>
                <span className="perf-value-glass">Alpha</span>
              </div>
              <div className="perf-item-glass">
                <span>📏 Total Distance Covered</span>
                <span className="perf-value-glass">2,847 km</span>
              </div>
              <div className="perf-item-glass">
                <span>🛢️ Fuel Saved</span>
                <span className="perf-value-glass green">142 L</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;