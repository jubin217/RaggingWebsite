import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  AlertTriangle,
  Activity,
  Users,
  ShieldCheck,
  Bell
} from "lucide-react";
import AlertOverlay from "../components/AlertOverlay";

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    totalRagging: 0,
    activeSensors: 1, // Default to 1 (the current system)
    safetyScore: 100,
    unacknowledged: 0
  });
  const [emergency, setEmergency] = useState(null);

  useEffect(() => {
    // Listen to Firestore 'alerts' collection for real-time updates
    const q = query(collection(db, "alerts"), orderBy("timestamp", "desc"), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alertList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAlerts(alertList);

      // Check for new unacknowledged emergency to show full-screen overlay
      const latest = alertList[0];
      if (latest && latest.isEmergency && !latest.acknowledged) {
        setEmergency(latest);
      }

      // Calculate real stats from the live feed
      const total = alertList.length;
      const unack = alertList.filter(a => !a.acknowledged).length;

      // Dynamic safety score: decreases as unacknowledged alerts increase
      const score = Math.max(0, 100 - (unack * 10));

      setStats({
        totalRagging: total,
        activeSensors: 1, // Reflecting the single detection system connected
        safetyScore: score,
        unacknowledged: unack
      });
    });

    return unsubscribe;
  }, []);

  const clearEmergency = async () => {
    if (emergency) {
      try {
        const alertRef = doc(db, "alerts", emergency.id);
        await updateDoc(alertRef, { acknowledged: true });
        setEmergency(null);
      } catch (err) {
        console.error("Error acknowledging alert:", err);
        setEmergency(null);
      }
    }
  };

  const triggerTestAlert = async () => {
    try {
      await addDoc(collection(db, "alerts"), {
        type: "Test Alert (Manual Trigger)",
        location: "System Test",
        timestamp: serverTimestamp(),
        isEmergency: true,
        acknowledged: false
      });
    } catch (err) {
      console.error("Error triggering test alert:", err);
    }
  };

  return (
    <div className="dashboard-grid">
      <AlertOverlay alert={emergency} onClear={clearEmergency} />

      {/* Row: Real-time Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' }}>
            <AlertTriangle size={20} />
          </div>
          <div className="stat-info">
            <h3>{stats.totalRagging}</h3>
            <p>Total Incidents</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
            <Activity size={20} />
          </div>
          <div className="stat-info">
            <h3>{stats.activeSensors}</h3>
            <p>System Online</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <ShieldCheck size={20} />
          </div>
          <div className="stat-info">
            <h3>{stats.safetyScore}%</h3>
            <p>Safety Score</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Bell size={20} />
          </div>
          <div className="stat-info">
            <h3>{stats.unacknowledged}</h3>
            <p>Pending Review</p>
          </div>
        </div>
      </div>

      <div className="main-grid">
        <section className="alerts-section">
          <div className="section-header">
            <h2>Real-time Detection Monitor</h2>
            <button onClick={triggerTestAlert} className="test-btn">Test Dashboard Alert</button>
          </div>
          <div className="alerts-list">
            {alerts.length === 0 ? (
              <div className="empty-state">No incidents detected. Premise is secure.</div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className={`alert-item ${alert.isEmergency && !alert.acknowledged ? 'emergency' : ''}`}>
                  <div className="alert-time">
                    {alert.timestamp?.toDate ? alert.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                  </div>
                  <div className="alert-body">
                    <h4>{alert.type}</h4>
                    <p>{alert.location} • {alert.acknowledged ? 'Resolved' : 'Active'}</p>
                  </div>
                  <div className="alert-status">
                    <span className={`badge ${alert.acknowledged ? 'success' : 'warning'}`}>
                      {alert.acknowledged ? 'Safe' : 'Action Needed'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="activity-section">
          <div className="section-header">
            <h2>Live Feed Status</h2>
          </div>
          <div className="activity-placeholder">
            <div className={`pulse-circle ${stats.activeSensors > 0 ? 'active' : ''}`}></div>
            <p>{stats.activeSensors > 0 ? "System is Monitoring..." : "System Offline"}</p>
          </div>
        </section>
      </div>

      <style jsx>{`
        .dashboard-grid { display: flex; flex-direction: column; gap: 2rem; }
        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
        .stat-card { background: var(--bg-card); padding: 1.5rem; border-radius: 1rem; border: 1px solid rgba(255, 255, 255, 0.05); display: flex; align-items: center; gap: 1.25rem; }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; justify-content: center; align-items: center; }
        .stat-info h3 { font-family: 'Outfit', sans-serif; font-size: 1.5rem; margin: 0; }
        .stat-info p { font-size: 0.875rem; color: var(--text-muted); margin: 0; }
        .main-grid { display: grid; grid-template-columns: 1fr 300px; gap: 2rem; }
        .alerts-section, .activity-section { background: var(--bg-card); border-radius: 1.5rem; padding: 1.5rem; border: 1px solid rgba(255, 255, 255, 0.05); }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .section-header h2 { font-family: 'Outfit', sans-serif; font-size: 1.25rem; margin: 0; }
        .alerts-list { display: flex; flex-direction: column; gap: 1rem; }
        .alert-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(15, 23, 42, 0.4); border-radius: 1rem; border: 1px solid rgba(255, 255, 255, 0.03); transition: all 0.2s; }
        .alert-item.emergency { border-left: 4px solid #f43f5e; background: rgba(244, 63, 94, 0.05); animation: alert-pulse 2s infinite; }
        @keyframes alert-pulse { 
          0% { box-shadow: inset 4px 0 0 #f43f5e; }
          50% { box-shadow: inset 10px 0 20px rgba(244, 63, 94, 0.2); }
          100% { box-shadow: inset 4px 0 0 #f43f5e; }
        }
        .alert-time { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; min-width: 60px; }
        .alert-body { flex: 1; }
        .alert-body h4 { margin: 0; font-size: 0.9375rem; }
        .alert-body p { margin: 0.25rem 0 0; font-size: 0.8125rem; color: var(--text-muted); }
        .badge { padding: 0.25rem 0.75rem; border-radius: 2rem; font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; }
        .badge.success { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .badge.warning { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .empty-state { padding: 2rem; text-align: center; color: var(--text-muted); font-style: italic; }
        .activity-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; min-height: 200px; color: var(--text-muted); font-size: 0.875rem; }
        .pulse-circle { width: 12px; height: 12px; background: #94a3b8; border-radius: 50%; margin-bottom: 1rem; transition: background 0.5s; }
        .pulse-circle.active { background: var(--success); box-shadow: 0 0 0 rgba(16, 185, 129, 0.4); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
        .test-btn { padding: 0.5rem 1rem; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); color: var(--primary); border-radius: 0.5rem; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .test-btn:hover { background: var(--primary); color: white; }
      `}</style>
    </div>
  );
}
