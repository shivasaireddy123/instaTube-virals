import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { 
  Store, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  Phone, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';

const AdminSellers = () => {
  const { showToast } = useCart();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Reject modal state
  const [rejectModalId, setRejectModalId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const res = await api.get('/sellers/admin/list/', { params });
      setSellers(res.data);
    } catch (err) {
      console.error('Failed to load sellers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [filterStatus]);

  const handleUpdateStatus = async (sellerId, newStatus, reason = '') => {
    try {
      setActionLoading(true);
      const res = await api.post(`/sellers/admin/approve/${sellerId}/`, {
        approval_status: newStatus,
        rejection_reason: reason,
      });
      showToast(res.data.message || `Seller marked as ${newStatus}`, 'success');
      setSellers(sellers.map((s) => (s.id === sellerId ? { ...s, approval_status: newStatus, rejection_reason: reason } : s)));
      setRejectModalId(null);
      setRejectReason('');
    } catch (err) {
      showToast('Failed to update seller status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--earth-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
              <ArrowLeft size={15} /> Back to Admin Overview
            </Link>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.4rem', marginBottom: '0.25rem' }}>Seller Verification & Review</h1>
              <p style={{ color: 'var(--earth-muted)' }}>Vet artisan workshops and organic producers before granting selling privileges.</p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setFilterStatus('')}
                className={`btn btn-sm ${filterStatus === '' ? 'btn-primary' : 'btn-outline'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('PENDING')}
                className={`btn btn-sm ${filterStatus === 'PENDING' ? 'btn-primary' : 'btn-outline'}`}
                style={filterStatus === 'PENDING' ? { backgroundColor: 'var(--warning)', borderColor: 'var(--warning)' } : {}}
              >
                Pending Review
              </button>
              <button
                onClick={() => setFilterStatus('APPROVED')}
                className={`btn btn-sm ${filterStatus === 'APPROVED' ? 'btn-primary' : 'btn-outline'}`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilterStatus('REJECTED')}
                className={`btn btn-sm ${filterStatus === 'REJECTED' ? 'btn-primary' : 'btn-outline'}`}
              >
                Rejected
              </button>
            </div>
          </div>
        </div>

        {/* Sellers Table */}
        {loading ? (
          <div style={{ padding: '5rem 0', textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--border-color)',
              borderTopColor: 'var(--forest-green)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem auto'
            }}></div>
            <p style={{ color: 'var(--earth-muted)' }}>Loading sellers...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : sellers.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            padding: '4rem 2rem',
            textAlign: 'center'
          }}>
            <Store size={48} color="var(--earth-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Sellers Found</h3>
            <p style={{ color: 'var(--earth-muted)' }}>No seller registrations match the selected filter.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Store / Business</th>
                  <th>Creator / Owner</th>
                  <th>Workshop Address</th>
                  <th>Products Listed</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{seller.business_name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--earth-muted)', maxWidth: '280px', lineHeight: '1.4' }}>
                          {seller.business_description || 'Independent artisan / grower'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{seller.user?.first_name} {seller.user?.last_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--earth-muted)' }}>{seller.user?.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--earth-dark)' }}>{seller.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', maxWidth: '220px', color: 'var(--earth-dark)' }}>
                        {seller.business_address}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{seller.products_count} items</span>
                    </td>
                    <td>
                      <span className={`badge ${seller.approval_status === 'APPROVED' ? 'badge-approved' : seller.approval_status === 'REJECTED' ? 'badge-error' : 'badge-pending'}`}>
                        {seller.approval_status}
                      </span>
                      {seller.rejection_reason && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '0.2rem' }}>
                          Reason: {seller.rejection_reason}
                        </div>
                      )}
                    </td>
                    <td>{new Date(seller.created_at).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        {seller.approval_status !== 'APPROVED' && (
                          <button
                            onClick={() => handleUpdateStatus(seller.id, 'APPROVED')}
                            disabled={actionLoading}
                            className="btn btn-sm btn-primary"
                            title="Approve Seller"
                          >
                            <CheckCircle2 size={14} /> Approve
                          </button>
                        )}
                        {seller.approval_status !== 'REJECTED' && (
                          <button
                            onClick={() => setRejectModalId(seller.id)}
                            disabled={actionLoading}
                            className="btn btn-sm btn-outline"
                            style={{ color: 'var(--error)' }}
                            title="Reject Seller"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Rejection Modal */}
        {rejectModalId && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '480px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.25rem' }}>Reject Seller Application</h3>
                <button onClick={() => setRejectModalId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p style={{ color: 'var(--earth-dark)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Please provide a brief reason for rejecting this seller application so the applicant can understand what requirements were missing.
                </p>
                <div className="form-group">
                  <label className="form-label">Rejection Reason</label>
                  <textarea
                    rows="3"
                    className="form-textarea"
                    placeholder="e.g. Incomplete workshop address or product line not aligned with handcrafted standards."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={() => setRejectModalId(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateStatus(rejectModalId, 'REJECTED', rejectReason)}
                  disabled={actionLoading}
                  className="btn btn-terracotta"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSellers;
