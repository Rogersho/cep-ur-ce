import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from 'react-i18next';
import API_BASE from '../../api';
import { Shield, Key, Trash2, Edit2, X, AlertTriangle } from 'lucide-react';

const ManageUsers = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    
    const [isEditing, setIsEditing] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ userId: null, newPassword: '' });

    // Fetch Users
    const { data: users, isLoading } = useQuery({
        queryKey: ['admin-users-full'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/api/auth/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return res.data;
        }
    });

    const updateRoleStatusMutation = useMutation({
        mutationFn: async ({ id, role, status }) => {
            const token = localStorage.getItem('token');
            return axios.put(`${API_BASE}/api/auth/users/${id}`, { role, status }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users-full']);
            addToast('User updated successfully', 'success');
            setIsEditing(false);
            setEditUser(null);
        },
        onError: (err) => addToast(err?.response?.data?.message || 'Error updating user', 'error')
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (id) => {
            const token = localStorage.getItem('token');
            return axios.delete(`${API_BASE}/api/auth/users/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users-full']);
            addToast('User deleted', 'success');
        },
        onError: (err) => addToast(err?.response?.data?.message || 'Error deleting user', 'error')
    });

    const changePasswordMutation = useMutation({
        mutationFn: async ({ userId, newPassword }) => {
            const token = localStorage.getItem('token');
            return axios.put(`${API_BASE}/api/auth/users/${userId}/password`, { newPassword }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        },
        onSuccess: () => {
            addToast('Password changed successfully', 'success');
            setShowPasswordModal(false);
            setPasswordData({ userId: null, newPassword: '' });
        },
        onError: (err) => addToast(err?.response?.data?.message || 'Error changing password', 'error')
    });

    const handleUpdateUser = (e) => {
        e.preventDefault();
        updateRoleStatusMutation.mutate({
            id: editUser.id,
            role: editUser.role,
            status: editUser.status
        });
    };

    if (isLoading) return <p>Loading users...</p>;

    return (
        <div>
            <div className="admin-header" style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Manage <span style={{ color: 'var(--primary)' }}>Users</span>
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>System Admin Control Panel</p>
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Username</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Email</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Role</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{u.username}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ 
                                        padding: '0.2rem 0.5rem', 
                                        borderRadius: '12px', 
                                        fontSize: '0.8rem', 
                                        background: u.role === 'system_admin' ? 'rgba(139, 92, 246, 0.2)' : 
                                                    u.role === 'cep_admin' ? 'rgba(56, 189, 248, 0.2)' : 
                                                    u.role === 'choir_header' ? 'rgba(250, 204, 21, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                                        color: u.role === 'system_admin' ? '#8b5cf6' : 
                                               u.role === 'cep_admin' ? '#38bdf8' : 
                                               u.role === 'choir_header' ? '#facc15' : '#9ca3af'
                                    }}>
                                        {u.role.replace('_', ' ').toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ 
                                        padding: '0.2rem 0.5rem', 
                                        borderRadius: '12px', 
                                        fontSize: '0.8rem', 
                                        background: u.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: u.status === 'active' ? '#22c55e' : '#ef4444'
                                    }}>
                                        {u.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <button 
                                        onClick={() => { setIsEditing(true); setEditUser({ ...u }); }}
                                        style={{ padding: '0.4rem', color: 'var(--primary)', background: 'none' }}
                                        title="Edit Role/Status"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => { setShowPasswordModal(true); setPasswordData({ userId: u.id, newPassword: '' }); }}
                                        style={{ padding: '0.4rem', color: '#f59e0b', background: 'none' }}
                                        title="Change Password"
                                    >
                                        <Key size={18} />
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete ${u.username}? This is irreversible.`)) {
                                                deleteUserMutation.mutate(u.id);
                                            }
                                        }}
                                        style={{ padding: '0.4rem', color: '#ef4444', background: 'none' }}
                                        title="Delete User"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit User Modal */}
            {isEditing && editUser && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem'
                }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: 'var(--radius)', position: 'relative', background: 'var(--card-bg)' }}>
                        <button onClick={() => { setIsEditing(false); setEditUser(null); }} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', color: 'var(--text-muted)' }}>
                            <X size={24} />
                        </button>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={20} color="var(--primary)" /> Edit User Access
                        </h2>
                        
                        <form onSubmit={handleUpdateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Role</label>
                                <select
                                    value={editUser.role}
                                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                >
                                    <option value="member">Member</option>
                                    <option value="choir_header">Choir Header</option>
                                    <option value="cep_admin">CEP Admin</option>
                                    <option value="system_admin">System Admin</option>
                                </select>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Status</label>
                                <select
                                    value={editUser.status}
                                    onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                >
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>

                            <button type="submit" className="btn-primary" style={{ padding: '0.75rem', marginTop: '1rem' }} disabled={updateRoleStatusMutation.isLoading}>
                                {updateRoleStatusMutation.isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && passwordData.userId && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem'
                }}>
                    <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: 'var(--radius)', position: 'relative', background: 'var(--card-bg)' }}>
                        <button onClick={() => { setShowPasswordModal(false); setPasswordData({ userId: null, newPassword: '' }); }} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', color: 'var(--text-muted)' }}>
                            <X size={24} />
                        </button>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Key size={20} color="#f59e0b" /> Change Password
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <AlertTriangle size={14} color="#f59e0b" /> Force password reset
                        </p>
                        
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (passwordData.newPassword.length < 6) return addToast("Password must be at least 6 characters", "error");
                            changePasswordMutation.mutate(passwordData);
                        }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--white)', color: 'var(--text-main)' }}
                                    placeholder="Enter new password"
                                    minLength="6"
                                />
                            </div>

                            <button type="submit" className="btn-primary" style={{ padding: '0.75rem', marginTop: '1rem', background: '#f59e0b', color: 'white' }} disabled={changePasswordMutation.isLoading}>
                                {changePasswordMutation.isLoading ? 'Changing...' : 'Set Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
