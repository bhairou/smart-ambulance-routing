import React, { useState } from 'react';
import './Dijkstra.css';

const Dijkstra = () => {
  // ===== GRAPH (Road Network) =====
  const [graph] = useState({
    'LPU Gate': { 'Block 1': 2, 'Block 2': 3, 'Library': 4 },
    'Block 1': { 'LPU Gate': 2, 'Canteen': 5, 'South Campus': 6 },
    'Block 2': { 'LPU Gate': 3, 'Canteen': 4, 'Library': 2 },
    'Library': { 'LPU Gate': 4, 'Block 2': 2, 'South Campus': 3 },
    'Canteen': { 'Block 1': 5, 'Block 2': 4, 'Hostel': 3 },
    'South Campus': { 'Block 1': 6, 'Library': 3, 'Hostel': 2 },
    'Hostel': { 'Canteen': 3, 'South Campus': 2, 'Hospital': 4 },
    'Hospital': { 'Hostel': 4, 'City Center': 5 },
    'City Center': { 'Hospital': 5, 'Model Town': 3 },
    'Model Town': { 'City Center': 3, 'GT Road': 6 },
    'GT Road': { 'Model Town': 6, 'Phagwara': 4 },
    'Phagwara': { 'GT Road': 4, 'Jalandhar': 5 },
    'Jalandhar': { 'Phagwara': 5, 'Kapurthala': 7 },
    'Kapurthala': { 'Jalandhar': 7 }
  });

  const [startNode, setStartNode] = useState('LPU Gate');
  const [endNode, setEndNode] = useState('Hospital');
  const [result, setResult] = useState(null);
  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===== DIJKSTRA ALGORITHM =====
  const dijkstra = (graph, start, end) => {
    const nodes = Object.keys(graph);
    const distances = {};
    const previous = {};
    const unvisited = new Set(nodes);

    nodes.forEach(node => {
      distances[node] = Infinity;
      previous[node] = null;
    });
    distances[start] = 0;

    while (unvisited.size > 0) {
      let minNode = null;
      let minDist = Infinity;
      unvisited.forEach(node => {
        if (distances[node] < minDist) {
          minDist = distances[node];
          minNode = node;
        }
      });

      if (minNode === null || minDist === Infinity) break;
      if (minNode === end) break;

      unvisited.delete(minNode);

      const neighbors = graph[minNode] || {};
      for (const [neighbor, weight] of Object.entries(neighbors)) {
        if (unvisited.has(neighbor)) {
          const newDist = distances[minNode] + weight;
          if (newDist < distances[neighbor]) {
            distances[neighbor] = newDist;
            previous[neighbor] = minNode;
          }
        }
      }
    }

    const path = [];
    let current = end;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }

    return {
      distance: distances[end],
      path: path,
      visited: Object.keys(distances).filter(n => distances[n] < Infinity)
    };
  };

  // ===== HANDLE CALCULATE =====
  const handleCalculate = () => {
    if (!startNode || !endNode) {
      alert('Please select both start and end locations!');
      return;
    }
    if (startNode === endNode) {
      alert('Start and end locations cannot be the same!');
      return;
    }

    setLoading(true);
    setResult(null);
    setPath([]);

    setTimeout(() => {
      const result = dijkstra(graph, startNode, endNode);
      if (result.distance === Infinity) {
        alert('No path found between these locations!');
        setLoading(false);
        return;
      }
      setResult(result);
      setPath(result.path);
      setLoading(false);
    }, 500);
  };

  // ===== RESET =====
  const handleReset = () => {
    setResult(null);
    setPath([]);
    setStartNode('LPU Gate');
    setEndNode('Hospital');
  };

  return (
    // ✅ DARK BACKGROUND ADD KARO
    <div style={{
      minHeight: '100vh',
      background: '#0a0e1a',
      padding: '30px 40px',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <div className="dijkstra-header">
        <h2>🗺️ Dijkstra Algorithm - Shortest Path</h2>
        <p>Find the fastest route between two locations</p>
      </div>

      <div className="dijkstra-main">
        {/* Controls */}
        <div className="dijkstra-controls">
          <div className="control-group">
            <label>📍 Start Location</label>
            <select value={startNode} onChange={(e) => setStartNode(e.target.value)}>
              {Object.keys(graph).map(node => (
                <option key={node} value={node}>{node}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>📍 End Location</label>
            <select value={endNode} onChange={(e) => setEndNode(e.target.value)}>
              {Object.keys(graph).map(node => (
                <option key={node} value={node}>{node}</option>
              ))}
            </select>
          </div>

          <div className="control-buttons">
            <button className="calc-btn" onClick={handleCalculate} disabled={loading}>
              {loading ? '⏳ Calculating...' : '🚀 Find Shortest Path'}
            </button>
            <button className="reset-btn" onClick={handleReset}>🔄 Reset</button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="dijkstra-results">
            <div className="result-card">
              <div className="result-header">
                <span className="result-icon">✅</span>
                <h3>Shortest Path Found!</h3>
              </div>
              <div className="result-details">
                <div className="result-item">
                  <span className="result-label">📍 Start</span>
                  <span className="result-value">{startNode}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">📍 End</span>
                  <span className="result-value">{endNode}</span>
                </div>
                <div className="result-item highlight">
                  <span className="result-label">📏 Total Distance</span>
                  <span className="result-value">{result.distance} km</span>
                </div>
                <div className="result-item">
                  <span className="result-label">🚦 Nodes Visited</span>
                  <span className="result-value">{result.visited.length}</span>
                </div>
              </div>
            </div>

            {/* Path Visualization */}
            <div className="path-card">
              <h4>🗺️ Path Visualization</h4>
              <div className="path-steps">
                {path.map((node, index) => (
                  <div key={index} className="path-step">
                    <span className="step-node">{node}</span>
                    {index < path.length - 1 && (
                      <span className="step-arrow">→</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="path-summary">
                <span>🚗 Estimated Travel Time: <strong>{(result.distance * 2.5).toFixed(1)} min</strong></span>
                <span>🛣️ {path.length - 1} roads to travel</span>
              </div>
            </div>

            {/* Traffic Weight Info */}
            <div className="traffic-card">
              <h4>🚦 Traffic Weight Information</h4>
              <p>Each edge has a weight representing travel distance in km.</p>
              <div className="traffic-legend">
                <div className="legend-item"><span className="legend-color green"></span> 1-3 km (Clear)</div>
                <div className="legend-item"><span className="legend-color yellow"></span> 4-5 km (Moderate)</div>
                <div className="legend-item"><span className="legend-color red"></span> 6-7 km (Heavy)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dijkstra;