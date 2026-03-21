import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
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
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Calendar, Download, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

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

export default function Statistics() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    const [chartData, setChartData] = useState({
        line: { labels: [], datasets: [] },
        donut: { labels: [], datasets: [] }
    });

    useEffect(() => {
        if (!currentUser) return;

        const alertsRef = collection(db, "users", currentUser.uid, "alerts");
        const q = query(alertsRef, orderBy("timestamp", "desc"), limit(100));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const alertList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAlerts(alertList);
            processData(alertList);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

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

        // 2. Process Types (Doughnut Chart)
        const typesCount = {};
        data.forEach(alert => {
            const type = alert.type || "Unknown";
            typesCount[type] = (typesCount[type] || 0) + 1;
        });

        setChartData({
            line: {
                labels: last7Days.map(d => d.label),
                datasets: [{
                    label: 'Incidents',
                    data: last7Days.map(d => d.count),
                    fill: true,
                    backgroundColor: 'rgba(139, 92, 246, 0.15)',
                    borderColor: '#8b5cf6',
                    borderWidth: 3,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#8b5cf6',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.4,
                }]
            },
            donut: {
                labels: Object.keys(typesCount).length ? Object.keys(typesCount) : ['No Data'],
                datasets: [{
                    data: Object.keys(typesCount).length ? Object.values(typesCount) : [1],
                    backgroundColor: [
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(139, 92, 246, 0.8)'
                    ].slice(0, Math.max(1, Object.keys(typesCount).length)),
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            }
        });
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: { family: 'Outfit', size: 14 },
                bodyFont: { family: 'Inter', size: 13 },
                padding: 12,
                cornerRadius: 8,
                displayColors: false
            }
        },
        scales: {
            y: { 
                grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false }, 
                ticks: { color: '#94a3b8', stepSize: 1, font: { family: 'Inter' } } 
            },
            x: { 
                grid: { display: false, drawBorder: false }, 
                ticks: { color: '#94a3b8', font: { family: 'Inter' } } 
            }
        },
        interaction: { intersect: false, mode: 'index' }
    };

    const donutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#f8fafc', font: { family: 'Inter', size: 12 }, padding: 20 } }
        },
        cutout: '75%'
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="stats-container"
        >
            <div className="stats-header">
                <div className="date-range glass-panel">
                    <Calendar size={18} color="#8b5cf6" />
                    <span>Analytics Overview (My Devices)</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {loading && <RefreshCcw className="animate-spin" size={18} color="#94a3b8" />}
                    <button className="btn export-btn" onClick={() => window.print()}>
                        <Download size={18} />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            <div className="charts-grid">
                <motion.div whileHover={{ scale: 1.01 }} className="glass-panel chart-card">
                    <h3>Incident Frequency <span>(Last 7 Days)</span></h3>
                    <div className="chart-wrapper">
                        {alerts.length > 0 ? (
                            <Line data={chartData.line} options={lineOptions} />
                        ) : (
                            <div className="no-data">No metrics available</div>
                        )}
                    </div>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.01 }} className="glass-panel chart-card donut-card">
                    <h3>Distribution by Type</h3>
                    <div className="chart-wrapper">
                        <Doughnut data={chartData.donut} options={donutOptions} />
                        {alerts.length > 0 && (
                            <div className="donut-center">
                                <span>{alerts.length}</span>
                                <small>Total</small>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="glass-panel recent-history">
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
                                <tr><td colSpan="4" className="empty-row">Audit log empty.</td></tr>
                            ) : (
                                alerts.map((alert) => (
                                    <motion.tr 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        key={alert.id}
                                    >
                                        <td className="time-col">{alert.timestamp?.toDate ? alert.timestamp.toDate().toLocaleString() : "Just now"}</td>
                                        <td className="type-col">{alert.type}</td>
                                        <td className="loc-col">{alert.location}</td>
                                        <td>
                                            <span className={`sev-tag ${alert.acknowledged ? 'low' : 'high'}`}>
                                                {alert.acknowledged ? 'RESOLVED' : 'PENDING'}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
        .stats-container { display: flex; flex-direction: column; gap: 2rem; }
        .stats-header { display: flex; justify-content: space-between; align-items: center; }
        .date-range { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.25rem; color: var(--text-main); font-size: 0.9rem; font-weight: 500; }
        .export-btn { display: flex; align-items: center; gap: 0.75rem; width: auto; padding: 0.75rem 1.5rem; }
        .charts-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
        .chart-card { padding: 1.75rem; display: flex; flex-direction: column; }
        .chart-card h3 { margin: 0 0 1.5rem 0; font-size: 1.1rem; color: white; display: flex; justify-content: space-between; }
        .chart-card h3 span { color: var(--text-muted); font-size: 0.85rem; font-weight: 400; }
        .chart-wrapper { height: 300px; position: relative; flex: 1; }
        .donut-card .chart-wrapper { height: 280px; }
        .donut-center { position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; pointer-events: none; }
        .donut-center span { font-family: 'Outfit', sans-serif; font-size: 2.5rem; font-weight: 800; color: white; line-height: 1; }
        .donut-center small { color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; margin-top: 0.25rem; }
        .no-data { height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-style: italic; font-size: 0.9rem; }
        .recent-history { padding: 1.75rem; }
        .recent-history h3 { margin: 0 0 1.5rem 0; font-size: 1.1rem; color: white; }
        .table-responsive { overflow-x: auto; margin: -0.5rem; padding: 0.5rem; }
        .history-table { width: 100%; border-collapse: separate; border-spacing: 0 0.5rem; }
        .history-table th { text-align: left; padding: 0.5rem 1rem; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; }
        .history-table td { padding: 1.25rem 1rem; font-size: 0.9rem; background: rgba(255, 255, 255, 0.02); }
        .history-table tr td:first-child { border-top-left-radius: 0.75rem; border-bottom-left-radius: 0.75rem; }
        .history-table tr td:last-child { border-top-right-radius: 0.75rem; border-bottom-right-radius: 0.75rem; }
        .history-table tbody tr { transition: transform 0.2s; }
        .history-table tbody tr:hover { transform: scale(1.01); background: rgba(255, 255, 255, 0.04); }
        .time-col { color: var(--text-muted); font-weight: 500; }
        .type-col { font-weight: 600; color: white; }
        .sev-tag { padding: 0.35rem 0.85rem; border-radius: 2rem; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.5px; }
        .sev-tag.high { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
        .sev-tag.low { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
        .empty-row { text-align: center; padding: 3rem !important; color: var(--text-muted); font-style: italic; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </motion.div>
    );
}
