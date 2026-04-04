import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const activeCount = users.filter(u => u.isActive).length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <div className="header-logo">👤</div>
          <h1>User Management Panel</h1>
        </div>
        <div className="header-right">
          <div className="header-user">
            <div className="header-avatar">{getInitials(currentUser?.name)}</div>
            <div className="header-user-info">
              <span className="header-user-name">{currentUser?.name}</span>
              <span className="header-user-role">{currentUser?.role}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>Sign out</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">👥</div>
            <div className="stat-card-label">Total Users</div>
            <div className="stat-card-value">{users.length}</div>
            <div className="stat-card-sub">Registered accounts</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div className="stat-card-label">Active Users</div>
            <div className="stat-card-value">{activeCount}</div>
            <div className="stat-card-sub">Currently active</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">🛡️</div>
            <div className="stat-card-label">Admins</div>
            <div className="stat-card-value">{adminCount}</div>
            <div className="stat-card-sub">Administrator accounts</div>
          </div>
        </div>

        <div className="table-section">
          <div className="table-header">
            <h2>All Users</h2>
            <span className="table-count">{users.length} total</span>
          </div>

          {loading ? (
            <div className="loading">Loading users...</div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">{getInitials(user.name)}</div>
                        <div>
                          <div className="user-name">{user.name}</div>
                          <div className="user-id">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td><span className={`badge badge-${user.role}`}>{user.role}</span></td>
                    <td><span className={`badge ${user.isActive ? 'badge-active' : 'badge-inactive'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn-edit" onClick={() => navigate(`/users/${user.id}/edit`)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDelete(user.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
