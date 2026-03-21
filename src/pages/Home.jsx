import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Eye, BellRing, Activity, ArrowRight, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
    const { currentUser } = useAuth();
    
    return (
        <div className="home-container">
            {/* Navigation Header */}
            <nav className="home-nav">
                <div className="brand">
                    <Shield size={32} color="#8b5cf6" />
                    <span>RaggingGuard</span>
                </div>
                <div className="nav-actions">
                    <Link to="/dashboard" className="profile-btn">
                        {currentUser ? (
                            <span className="user-email">{currentUser.email.split('@')[0]}</span>
                        ) : (
                            <span className="login-text">Sign In</span>
                        )}
                        <UserCircle size={28} />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="hero-content"
                >
                    <div className="status-pill">
                        <span className="live-dot"></span> System is Live
                    </div>
                    <h1 className="hero-title">
                        Proactive Campus <span className="highlight">Safety</span>
                    </h1>
                    <p className="hero-subtitle">
                        Advanced AI-driven surveillance that detects physical violence and abusive speech instantly, enabling rapid response to protect institutional integrity.
                    </p>
                    <div className="hero-cta">
                        <Link to="/dashboard" className="btn btn-primary start-btn">
                            Access Dashboard <ArrowRight size={20} />
                        </Link>
                    </div>
                </motion.div>
                
                {/* Abstract graphic representing the dashboard/AI */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="hero-visual"
                >
                    <div className="abstract-card glass-panel">
                        <div className="mock-header">
                            <div className="mock-dot red"></div>
                            <div className="mock-dot yellow"></div>
                            <div className="mock-dot green"></div>
                        </div>
                        <div className="mock-body">
                            <div className="mock-line wide"></div>
                            <div className="mock-line short"></div>
                            <div className="mock-alert pulse">
                                <Shield size={40} color="#f43f5e" />
                                <div>
                                    <div className="mock-text-strong">Incident Prevented</div>
                                    <div className="mock-text-dim">10 Seconds Ago</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Features Section */}
            <section className="features-section">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="feature-card glass-panel"
                >
                    <Eye className="feature-icon" color="#8b5cf6" size={32} />
                    <h3>Vision AI</h3>
                    <p>Real-time skeletal tracking detects aggressive postures and physical alters instantly without human oversight.</p>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="feature-card glass-panel"
                >
                    <Activity className="feature-icon" color="#10b981" size={32} />
                    <h3>Acoustic Analysis</h3>
                    <p>Detects hateful speech, abuse, and prohibited vocabulary through continuous, secure edge-processing.</p>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="feature-card glass-panel"
                >
                    <BellRing className="feature-icon" color="#f59e0b" size={32} />
                    <h3>Instant Telemetry</h3>
                    <p>Sub-second alerting routes exact incident locations and severity metrics to your synchronized device dashboard.</p>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <p>&copy; {new Date().getFullYear()} RaggingGuard System. Multi-Device Detection Framework.</p>
            </footer>

            <style jsx>{`
                .home-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background-color: var(--bg-dark);
                    background-image: 
                        radial-gradient(circle at 15% 10%, rgba(139, 92, 246, 0.1), transparent 30%),
                        radial-gradient(circle at 85% 60%, rgba(239, 68, 68, 0.05), transparent 30%);
                    color: white;
                }

                .home-nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 5%;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    background: rgba(2, 6, 23, 0.7);
                    backdrop-filter: blur(20px);
                    position: sticky;
                    top: 0;
                    z-index: 50;
                }

                .brand {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-family: 'Outfit', sans-serif;
                    font-size: 1.5rem;
                    font-weight: 800;
                }

                .profile-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: white;
                    text-decoration: none;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 0.5rem 1rem;
                    border-radius: 2rem;
                    transition: all 0.2s;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .profile-btn:hover {
                    background: rgba(139, 92, 246, 0.15);
                    border-color: rgba(139, 92, 246, 0.5);
                }

                .user-email, .login-text {
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .hero-section {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4rem;
                    padding: 6rem 5%;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .hero-content {
                    flex: 1;
                    max-width: 600px;
                }

                .status-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    padding: 0.5rem 1rem;
                    border-radius: 2rem;
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                }

                .live-dot {
                    width: 8px;
                    height: 8px;
                    background: #10b981;
                    border-radius: 50%;
                    animation: blink 2s infinite;
                }

                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }

                .hero-title {
                    font-size: 4rem;
                    line-height: 1.1;
                    margin: 0 0 1.5rem 0;
                }

                .hero-title .highlight {
                    background: linear-gradient(135deg, #a855f7, #6366f1);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-subtitle {
                    font-size: 1.15rem;
                    color: var(--text-muted);
                    line-height: 1.6;
                    margin-bottom: 2.5rem;
                }

                .start-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    padding: 1rem 2rem;
                    font-size: 1.1rem;
                    width: auto;
                    border-radius: 3rem;
                }

                .hero-visual {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                }

                .abstract-card {
                    width: 100%;
                    max-width: 450px;
                    height: 350px;
                    display: flex;
                    flex-direction: column;
                    transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
                    box-shadow: 20px 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(139, 92, 246, 0.2);
                }

                .mock-header {
                    padding: 1rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    display: flex;
                    gap: 0.5rem;
                }

                .mock-dot { width: 12px; height: 12px; border-radius: 50%; }
                .red { background: #f43f5e; }
                .yellow { background: #f59e0b; }
                .green { background: #10b981; }

                .mock-body {
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    height: 100%;
                    justify-content: center;
                }

                .mock-line {
                    height: 12px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 4px;
                }
                .wide { width: 80%; }
                .short { width: 50%; }

                .mock-alert {
                    margin-top: auto;
                    background: rgba(244, 63, 94, 0.1);
                    border: 1px solid rgba(244, 63, 94, 0.2);
                    padding: 1.5rem;
                    border-radius: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .pulse {
                    animation: alert-pulse 2s infinite;
                }

                @keyframes alert-pulse {
                    0% { box-shadow: inset 0 0 0 rgba(244, 63, 94, 0); }
                    50% { box-shadow: inset 0 0 20px rgba(244, 63, 94, 0.2); }
                    100% { box-shadow: inset 0 0 0 rgba(244, 63, 94, 0); }
                }

                .mock-text-strong { font-weight: 700; color: #f43f5e; font-size: 1.1rem; }
                .mock-text-dim { color: var(--text-muted); font-size: 0.8rem; margin-top: 0.25rem; }

                .features-section {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    padding: 4rem 5%;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .feature-card {
                    padding: 2.5rem;
                    transition: transform 0.3s;
                }
                
                .feature-card:hover {
                    transform: translateY(-5px);
                }

                .feature-icon {
                    margin-bottom: 1.5rem;
                }

                .feature-card h3 {
                    margin: 0 0 1rem 0;
                    font-size: 1.5rem;
                }

                .feature-card p {
                    color: var(--text-muted);
                    line-height: 1.6;
                    margin: 0;
                }

                .home-footer {
                    text-align: center;
                    padding: 2rem;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    border-top: 1px solid rgba(255,255,255,0.05);
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .hero-section {
                        flex-direction: column;
                        text-align: center;
                        padding-top: 4rem;
                    }
                    .hero-content {
                        align-items: center;
                        display: flex;
                        flex-direction: column;
                    }
                    .hero-visual { width: 100%; max-width: 500px; }
                }

                @media (max-width: 768px) {
                    .hero-title { font-size: 2.5rem; }
                    .hero-subtitle { font-size: 1rem; }
                    .abstract-card { height: 280px; }
                    .mock-alert { flex-direction: column; text-align: center; }
                    .features-section { padding: 2rem 5%; grid-template-columns: 1fr; }
                    .brand span { display: none; }
                }
            `}</style>
        </div>
    );
}
