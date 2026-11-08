import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle, 
  Edit2 
} from 'lucide-react';

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const { showToast } = useCart();

  const [name, setName] = useState(user?.first_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Address modal/form
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    full_name: user?.first_name || '',
    phone: user?.phone || '',
    street_address: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false,
  });

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await api.get('/accounts/addresses/');
      setAddresses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      await api.patch('/accounts/profile/', { first_name: name, phone });
      await refreshProfile();
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile.', 'error');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post('/accounts/addresses/', addressForm);
      showToast('New shipping address added!', 'success');
      setShowAddressModal(false);
      setAddressForm({
        full_name: user?.first_name || '',
        phone: user?.phone || '',
        street_address: '',
        city: '',
        state: '',
        pincode: '',
        is_default: false,
      });
      fetchAddresses();
    } catch (err) {
      showToast('Failed to add address.', 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/accounts/addresses/${id}/`);
      showToast('Address removed.', 'info');
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      showToast('Failed to delete address.', 'error');
    }
  };

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Account Profile</h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Profile Form */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            padding: '2rem'
          }}>
            <h2 style={{ fontSize: '1.45rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={22} color="var(--forest-green)" /> Personal Information
            </h2>

            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={user?.email || ''}
                  disabled
                  style={{ backgroundColor: 'var(--bg-muted)', cursor: 'not-allowed' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--earth-muted)' }}>Email address cannot be changed</span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="role">Account Role</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-tag" style={{ fontSize: '0.85rem' }}>
                    {user?.role}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label" htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <button type="submit" disabled={profileSaving} className="btn btn-primary">
                {profileSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          {/* Saved Addresses */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={22} color="var(--terracotta)" /> Saved Addresses
              </h2>
              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="btn btn-outline btn-sm"
              >
                <Plus size={15} /> Add New
              </button>
            </div>

            {loadingAddresses ? (
              <p style={{ color: 'var(--earth-muted)' }}>Loading addresses...</p>
            ) : addresses.length === 0 ? (
              <p style={{ color: 'var(--earth-muted)', fontSize: '0.95rem' }}>
                No saved shipping addresses found. Add one for expedited one-click checkout.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem 1.25rem',
                      backgroundColor: addr.is_default ? 'var(--forest-light)' : 'var(--bg-cream)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{addr.full_name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {addr.is_default && (
                          <span className="badge badge-approved" style={{ fontSize: '0.7rem' }}>Default</span>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--error)',
                            padding: '0.2rem'
                          }}
                          title="Delete address"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--earth-muted)', marginBottom: '0.25rem' }}>
                      {addr.street_address}, {addr.city}, {addr.state} - {addr.pincode}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--earth-dark)', fontWeight: 600 }}>
                      Phone: {addr.phone}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem' }}>Add Shipping Address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddAddress}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={addressForm.full_name}
                    onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <textarea
                    rows="2"
                    className="form-textarea"
                    value={addressForm.street_address}
                    onChange={(e) => setAddressForm({ ...addressForm, street_address: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    required
                  />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={addressForm.is_default}
                    onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                  />
                  <span style={{ fontSize: '0.875rem' }}>Make this my default shipping address</span>
                </label>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
