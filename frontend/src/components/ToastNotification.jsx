import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastNotification = () => {
  const { toasts, removeToast } = useCart();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <div style={{ flexShrink: 0 }}>
            {toast.type === 'success' && <CheckCircle2 size={18} color="#A5D6A7" />}
            {toast.type === 'error' && <AlertCircle size={18} color="#EF9A9A" />}
            {toast.type === 'info' && <Info size={18} color="#90CAF9" />}
          </div>
          <div style={{ flex: 1, fontSize: '0.875rem' }}>
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              padding: '0.2rem',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Close notification"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;
