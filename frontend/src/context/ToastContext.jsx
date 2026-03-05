import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, Bell } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        setTimeout(() => removeToast(id), duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                pointerEvents: 'none'
            }}>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onRemove }) => {
    const icons = {
        success: <CheckCircle size={20} color="#166534" />,
        error: <AlertCircle size={20} color="#991b1b" />,
        info: <Info size={20} color="#0369a1" />,
        warning: <Bell size={20} color="#92400e" />
    };

    const bgColors = {
        success: '#dcfce7',
        error: '#fee2e2',
        info: '#e0f2fe',
        warning: '#fef3c7'
    };

    const borderColors = {
        success: '#bbf7d0',
        error: '#fecaca',
        info: '#bae6fd',
        warning: '#fde68a'
    };

    return (
        <div
            className="glass"
            style={{
                pointerEvents: 'auto',
                minWidth: '300px',
                maxWidth: '450px',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                backgroundColor: bgColors[toast.type],
                border: `1px solid ${borderColors[toast.type]}`,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                animation: 'slideIn 0.3s ease-out forwards'
            }}
        >
            <div style={{ flexShrink: 0 }}>{icons[toast.type]}</div>
            <div style={{
                flex: 1,
                fontSize: '0.95rem',
                fontWeight: 500,
                color: '#1f2937',
                lineHeight: 1.4
            }}>
                {toast.message}
            </div>
            <button
                onClick={onRemove}
                style={{
                    flexShrink: 0,
                    background: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    borderRadius: '50%',
                    transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
                <X size={16} />
            </button>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};
