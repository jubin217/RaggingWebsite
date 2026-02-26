import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Calendar, Download, RefreshCcw } from "lucide-react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Statistics() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({
        line: { labels: [], datasets: [] },
        bar: { labels: [], datasets: [] }
    });

    useEffect(() => {
        const q = query(collection(db, "alerts"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const alertList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAlerts(alertList);
            processData(alertList);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const processData = (data) => {
        // 1. Process Line Chart (Incidents per Day - last 7 days)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            last7Days.push({
                label: days[d.getDay()],
                dateStr: d.toDateString(),
                count: 0
            });
        }

        data.forEach(alert => {
            if (alert.timestamp?.toDate) {
                const dateStr = alert.timestamp.toDate().toDateString();
                const dayMatch = last7Days.find(d => d.dateStr === dateStr);
                if (dayMatch) dayMatch.count++;
            }
        });

        // 2. Process Bar Chart (Incidents by Location)
        const locations = {};
        data.forEach(alert => {
            const loc = alert.location || "Unknown";
            locations[loc] = (locations[loc] || 0) + 1;
        });

        setChartData({
            line: {
                labels: last7Days.map(d => d.label),
                datasets: [{
                    label: 'Incidents',
                    data: last7Days.map(d => d.count),
                    fill: true,
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderColor: '#6366f1',
                    tension: 0.4,
                }]
            },
            bar: {
                labels: Object.keys(locations),
                datasets: [{
                    label: 'Incidents by Location',
                    data: Object.values(locations),
                    backgroundColor: 'rgba(244, 63, 94, 0.6)',
                    borderRadius: 8,
                }]
            }
        });
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8', stepSize: 1 } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
    };

    return (
        <div className="stats-container">
            <div className="stats-header">
                <div className="date-range">
                    <Calendar size={18} />
                    <span>Analytics Overview</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {loading && <RefreshCcw className="animate-spin" size={18} />}
                    <button className="export-btn" onClick={() => window.print()}>
                        <Download size={18} />
                        <span>Save PDF</span>
                    </button>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Incident Frequency (Last 7 Days)</h3>
                    <div className="chart-wrapper">
                        {alerts.length > 0 ? (
                            <Line data={chartData.line} options={options} />
                        ) : (
                            <div className="no-data">No data to display</div>
                        )}
                    </div>
                </div>
                <div className="chart-card">
                    <h3>Location Hotspots</h3>
                    <div className="chart-wrapper">
                        {alerts.length > 0 ? (
                            <Bar data={chartData.bar} options={options} />
                        ) : (
                            <div className="no-data">No data to display</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="recent-history card">
                <h3>System Audit Log</h3>
                <div className="table-responsive">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Type</th>
                                <th>Location</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.length === 0 ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Audit log empty.</td></tr>
                            ) : (
                                alerts.map((alert) => (
                                    <tr key={alert.id}>
                                        <td>{alert.timestamp?.toDate ? alert.timestamp.toDate().toLocaleString() : "Just now"}</td>
                                        <td>{alert.type}</td>
                                        <td>{alert.location}</td>
                                        <td>
                                            <span className={`sev-tag ${alert.acknowledged ? 'low' : 'high'}`}>
                                                {alert.acknowledged ? 'RESOLVED' : 'PENDING'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
        .stats-container { display: flex; flex-direction: column; gap: 2rem; }
        .stats-header { display: flex; justify-content: space-between; align-items: center; }
        .date-range { display: flex; align-items: center; gap: 0.75rem; background: var(--bg-card); padding: 0.5rem 1rem; border-radius: 0.75rem; color: var(--text-muted); font-size: 0.875rem; border: 1px solid rgba(255, 255, 255, 0.05); }
        .export-btn { display: flex; align-items: center; gap: 0.5rem; background: var(--primary); color: white; border: none; padding: 0.625rem 1.25rem; border-radius: 0.75rem; font-weight: 600; cursor: pointer; }
        .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .chart-card { background: var(--bg-card); padding: 1.5rem; border-radius: 1.5rem; border: 1px solid rgba(255, 255, 255, 0.05); }
        .chart-card h3 { margin-bottom: 1.5rem; font-size: 1rem; color: var(--text-muted); }
        .chart-wrapper { height: 300px; position: relative; }
        .no-data { height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-style: italic; }
        .history-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .history-table th { text-align: left; padding: 1rem; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .history-table td { padding: 1.25rem 1rem; font-size: 0.875rem; border-bottom: 1px solid rgba(255, 255, 255, 0.03); }
        .sev-tag { padding: 0.25rem 0.625rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 700; }
        .sev-tag.high { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }
        .sev-tag.low { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .card { background: var(--bg-card); padding: 2rem; border-radius: 1.5rem; border: 1px solid rgba(255, 255, 255, 0.05); }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .table-responsive { overflow-x: auto; }
      `}</style>
        </div>
    );
}
