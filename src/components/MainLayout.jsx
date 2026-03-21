import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard,
    BarChart3,
    User,
    LogOut,
    Shield,
    Bell
} from "lucide-react";

export default function MainLayout({ children }) {
    const { logout, currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    async function handleLogout() {
        try {
            await logout();
            navigate("/login");
        } catch (err) {
            console.error("Failed to log out", err);
        }
    }

    const menuItems = [
        { path: "/dashboard", name: "Dashboard", icon: LayoutDashboard },
        { path: "/statistics", name: "Statistics", icon: BarChart3 },
        { path: "/profile", name: "Profile", icon: User },
    ];

    return (
        <div className="layout-container">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <Shield size={32} color="#6366f1" />
                    <span>RaggingGuard</span>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="user-avatar">{currentUser?.email[0].toUpperCase()}</div>
                        <div className="user-details">
                            <p className="user-email">{currentUser?.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="mobile-bottom-nav" style={{ display: 'none' }}>
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        style={{ flexDirection: 'column', padding: '0.5rem', gap: '0.25rem', width: '33%', textAlign: 'center' }}
                    >
                        <item.icon size={20} />
                        <span style={{ fontSize: '0.65rem' }}>{item.name}</span>
                    </Link>
                ))}
            </nav>

            <main className="main-content">
                <header className="top-nav">
                    <div className="breadcrumb">
                        {menuItems.find(i => i.path === location.pathname)?.name || "Page"}
                    </div>
                    <div className="top-actions">
                        <button className="icon-btn">
                            <Bell size={20} />
                            <span className="notification-badge"></span>
                        </button>
                    </div>
                </header>
                <div className="content-inner">
                    {children}
                </div>
            </main>

            <style jsx>{`
            .layout-container {
              display: flex;
              min-height: 100vh;
              background-color: var(--bg-dark);
            }
            .sidebar {
              width: 260px;
              background: var(--bg-card);
              border-right: 1px solid rgba(255, 255, 255, 0.05);
              display: flex;
              flex-direction: column;
              padding: 2rem 1rem;
            }
            .sidebar-brand {
              display: flex;
              align-items: center;
              gap: 0.75rem;
              font-family: 'Outfit', sans-serif;
              font-size: 1.5rem;
              font-weight: 800;
              margin-bottom: 3rem;
              padding: 0 0.5rem;
            }
            .sidebar-nav {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
            }
            .nav-item {
              display: flex;
              align-items: center;
              gap: 1rem;
              padding: 0.875rem 1rem;
              border-radius: 0.75rem;
              text-decoration: none;
              color: var(--text-muted);
              transition: all 0.2s;
              font-weight: 500;
            }
            .nav-item:hover {
              background: rgba(255, 255, 255, 0.05);
              color: var(--text-main);
            }
            .nav-item.active {
              background: rgba(99, 102, 241, 0.1);
              color: var(--primary);
            }
            .sidebar-footer {
              margin-top: auto;
              padding-top: 1.5rem;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
            }
            .user-info {
              display: flex;
              align-items: center;
              gap: 0.75rem;
              margin-bottom: 1.5rem;
              padding: 0 0.5rem;
            }
            .user-avatar {
              width: 32px;
              height: 32px;
              background: var(--primary);
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-weight: 700;
              font-size: 0.875rem;
            }
            .user-email {
              font-size: 0.75rem;
              color: var(--text-muted);
              margin: 0;
              word-break: break-all;
            }
            .logout-btn {
              width: 100%;
              display: flex;
              align-items: center;
              gap: 0.75rem;
              padding: 0.75rem 1rem;
              background: transparent;
              border: none;
              color: #fca5a5;
              cursor: pointer;
              border-radius: 0.75rem;
              transition: all 0.2s;
              font-weight: 500;
            }
            .logout-btn:hover {
              background: rgba(244, 63, 94, 0.1);
            }
            .main-content {
              flex: 1;
              display: flex;
              flex-direction: column;
            }
            .top-nav {
              height: 80px;
              border-bottom: 1px solid rgba(255, 255, 255, 0.05);
              padding: 0 2rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .breadcrumb {
              font-family: 'Outfit', sans-serif;
              font-size: 1.25rem;
              font-weight: 700;
            }
            .icon-btn {
              background: transparent;
              border: none;
              color: var(--text-muted);
              cursor: pointer;
              position: relative;
            }
            .notification-badge {
              position: absolute;
              top: 0;
              right: 0;
              width: 8px;
              height: 8px;
              background: var(--accent);
              border-radius: 50%;
            }
            .content-inner {
              padding: 2rem;
              overflow-y: auto;
            }
            @media (max-width: 1024px) {
              .sidebar {
                width: 100%;
                height: auto;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                border-right: none;
                border-bottom: 1px solid rgba(255,255,255,0.05);
                padding: 1rem 1.5rem;
              }
              .sidebar-brand { margin-bottom: 0; }
              .sidebar-nav, .sidebar-footer { display: none; }
              .layout-container { flex-direction: column; }
            }
            @media (max-width: 768px) {
              .sidebar { display: none !important; }
              .top-nav { padding: 0 1rem; height: 60px; }
              .content-inner { padding: 1rem; }
            }
          `}</style>
        </div>
    );
}

