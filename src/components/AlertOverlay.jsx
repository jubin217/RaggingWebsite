import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function AlertOverlay({ alert, onClear }) {
    if (!alert) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="emergency-overlay"
            >
                <div className="alert-content">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="alert-icon-container"
                    >
                        <AlertTriangle size={80} color="#f43f5e" />
                    </motion.div>

                    <h1 className="alert-title">EMERGENCY DETECTED</h1>
                    <div className="alert-details">
                        <p><strong>Type:</strong> {alert.type || "Ragging/Violence"}</p>
                        <p><strong>Location:</strong> {alert.location || "Main Hallway"}</p>
                        <p><strong>Time:</strong> {alert.timestamp?.toDate().toLocaleString() || new Date().toLocaleString()}</p>
                    </div>

                    {alert.evidenceUrl && (
                        <div className="evidence-preview-container">
                            <p className="evidence-label">Live Capture Evidence</p>
                            <img src={alert.evidenceUrl} alt="Evidence" className="evidence-preview" />
                        </div>
                    )}

                    <div className="alert-actions">
                        <button className="btn btn-primary" onClick={onClear}>ACKNOWLEDGE ALERT</button>
                    </div>
                </div>

                <style jsx>{`
              .emergency-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(15, 23, 42, 0.95);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                padding: 2rem;
              }
              .alert-content {
                background: #1e293b;
                border: 4px solid #f43f5e;
                border-radius: 2rem;
                padding: 4rem;
                text-align: center;
                max-width: 600px;
                width: 100%;
                box-shadow: 0 0 100px rgba(244, 63, 94, 0.4);
              }
              .alert-icon-container {
                margin-bottom: 2rem;
              }
              .alert-title {
                font-family: 'Outfit', sans-serif;
                font-size: 3rem;
                font-weight: 800;
                color: #f43f5e;
                margin-bottom: 2rem;
              }
              .alert-details {
                background: rgba(15, 23, 42, 0.5);
                padding: 2rem;
                border-radius: 1rem;
                margin-bottom: 2rem;
                text-align: left;
                font-size: 1.25rem;
              }
              .alert-details p {
                margin: 0.5rem 0;
              }
              .evidence-preview-container {
                margin-bottom: 2rem;
              }
              .evidence-label {
                font-family: 'Outfit', sans-serif;
                color: #fca5a5;
                font-size: 1rem;
                margin-bottom: 0.5rem;
                text-transform: uppercase;
                letter-spacing: 1px;
                font-weight: 600;
              }
              .evidence-preview {
                width: 100%;
                max-height: 250px;
                object-fit: cover;
                border-radius: 0.5rem;
                border: 2px solid #f43f5e;
                box-shadow: 0 0 20px rgba(244, 63, 94, 0.2);
              }
            `}</style>
            </motion.div>
        </AnimatePresence>
    );
}

