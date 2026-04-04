import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, updateUser } from '../services/api';
import './Auth.css';

function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', role: 'user', isActive: true });
  const [message, setMessage] = useState('');

  useEffect(() => {
    getUserById(id).then(res => {
      const { name, email, role, isActive } = res.data;
      setForm({ name, email, role, isActive });
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(id, form);
      setMessage('User updated successfully!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setMessage('Failed to update user.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Edit User</h2>
        {message && <div className="success-msg">{message}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active
          </label>
          <button type="submit">Save Changes</button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default UserEdit;
