import React from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, CheckCircle2, Clock } from "lucide-react";

export default function Profile() {
    const { currentUser } = useAuth();

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="large-avatar">{currentUser?.email[0].toUpperCase()}</div>
                    <div>
                        <h2>Administrator</h2>
                        <p>Ragging Control Center</p>
                    </div>
                </div>

                <div className="profile-details">
                    <div className="detail-item">
                        <div className="detail-icon"><Mail size={20} /></div>
                        <div className="detail-info">
                            <label>Email Address</label>
                            <p>{currentUser?.email}</p>
                        </div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-icon"><Shield size={20} /></div>
                        <div className="detail-info">
                            <label>Role</label>
                            <p>System Superuser</p>
                        </div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-icon"><Clock size={20} /></div>
                        <div className="detail-info">
                            <label>Last Login</label>
                            <p>{new Date().toLocaleTimeString()} Today</p>
                        </div>
                    </div>
                </div>

                <div className="profile-status">
                    <div className="status-badge">
                        <CheckCircle2 size={16} color="#10b981" />
                        <span>Account Verified</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
            .profile-container { display: flex; justify-content: center; }
            .profile-card { background: var(--bg-card); padding: 3rem; border-radius: 2rem; width: 100%; max-width: 500px; border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .profile-header { display: flex; align-items: center; gap: 2rem; margin-bottom: 3rem; }
            .large-avatar { width: 80px; height: 80px; background: var(--primary); border-radius: 1.5rem; display: flex; justifyContent: center; align-items: center; font-size: 2.5rem; font-weight: 800; font-family: 'Outfit', sans-serif; }
            .profile-header h2 { margin: 0; font-family: 'Outfit', sans-serif; font-size: 1.5rem; }
            .profile-header p { margin: 0.25rem 0 0; color: var(--text-muted); }
            .profile-details { display: flex; flex-direction: column; gap: 1.5rem; }
            .detail-item { display: flex; align-items: center; gap: 1.5rem; padding: 1.25rem; background: rgba(15, 23, 42, 0.4); border-radius: 1.25rem; }
            .detail-icon { color: var(--primary); }
            .detail-info label { display: block; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 0.25rem; }
            .detail-info p { margin: 0; font-weight: 500; }
            .profile-status { margin-top: 3rem; display: flex; justify-content: center; }
            .status-badge { display: flex; align-items: center; gap: 0.5rem; background: rgba(16, 185, 129, 0.1); padding: 0.5rem 1rem; border-radius: 2rem; color: #10b981; font-size: 0.75rem; font-weight: 700; }
          `}</style>
        </div>
    );
}

