import { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNext: false,
    hasPrev: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      const params = {
        page: pagination.currentPage,
        limit: 10,
        search: searchTerm || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        isActive: statusFilter !== 'all' ? (statusFilter === 'active') : undefined
      };

      const response = await axios.get(`${BACKEND_URL}/api/admin/users`, { params });
      const data = response.data.data;
      
      setUsers(data.users || []);
      setPagination(data.pagination || pagination);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error fetching users:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/users/stats`);
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error.response?.data?.message || error.message);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await axios.patch(`${BACKEND_URL}/api/admin/users/${userId}/toggle-status`);
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error toggling user status:', error.response?.data?.message || error.message);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) return;
    
    try {
      await axios.post(`${BACKEND_URL}/api/admin/users/${selectedUser._id}/reset-password`, { newPassword });
      setShowPasswordModal(false);
      setNewPassword('');
      setSelectedUser(null);
      alert('Password reset successfully');
    } catch (error) {
      console.error('Error resetting password:', error.response?.data?.message || error.message);
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/admin/users/${userId}`);
      setSelectedUser(response.data.data.user);
      setShowUserModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error.response?.data?.message || error.message);
    }
  };

  // Remove client-side filtering since it's handled by backend
  const filteredUsers = users;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading users...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* User Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.overview.totalUsers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
            <p className="text-2xl font-bold text-green-600">{stats.overview.activeUsers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">New This Month</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.overview.newUsersThisMonth}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">With Orders</h3>
            <p className="text-2xl font-bold text-purple-600">{stats.engagement.usersWithOrders}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">Email Verified</h3>
            <p className="text-2xl font-bold text-indigo-600">{stats.verification.emailVerified}</p>
          </div>
        </div>
      )}

      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">No users found matching your criteria.</p>
        </div>
      ) : (
        <>
          {/* User Cards Grid - 4 cards per row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <div key={user._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                {/* Card Header with Avatar */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
                  <div className="flex justify-center mb-3">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.fullName}
                        className="h-20 w-20 rounded-full object-cover border-4 border-white"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`h-20 w-20 ${user.profilePicture ? 'hidden' : 'flex'} bg-white rounded-full items-center justify-center border-4 border-white`}>
                      <span className="text-blue-500 font-bold text-2xl">
                        {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg">
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.fullName || 'Unknown User'}
                  </h3>
                  <div className="mt-2 flex justify-center gap-2">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role || 'user'}
                    </span>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isActive)}`}>
                      {getStatusText(user.isActive)}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                    <p className="text-sm text-gray-900 truncate">{user.email}</p>
                  </div>

                  {user.phone && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Phone</label>
                      <p className="text-sm text-gray-900">{user.phone}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Join Date</label>
                      <p className="text-sm text-gray-900">{formatDate(user.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Orders</label>
                      <p className="text-sm text-gray-900 font-semibold">{user.totalOrders || 0}</p>
                    </div>
                  </div>

                  {user.oauthProvider && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">OAuth Provider</label>
                      <p className="text-sm">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.oauthProvider}
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Email Verified</label>
                      <p className="text-sm text-gray-900">{user.isEmailVerified ? '✅ Yes' : '❌ No'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Phone Verified</label>
                      <p className="text-sm text-gray-900">{user.isPhoneVerified ? '✅ Yes' : '❌ No'}</p>
                    </div>
                  </div>
                </div>

                {/* Card Footer - Actions */}
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex flex-col gap-2">
                  <button
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 text-sm font-medium"
                    onClick={() => handleViewUser(user._id)}
                  >
                    View Details
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="px-3 py-2 bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition duration-200 text-xs font-medium"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowPasswordModal(true);
                      }}
                    >
                      Reset Password
                    </button>
                    <button
                      className={`px-3 py-2 rounded-md transition duration-200 text-xs font-medium ${
                        user.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      onClick={() => handleToggleStatus(user._id)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 px-6 py-4 bg-white rounded-lg shadow-md flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalUsers} total users)
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={!pagination.hasNext}
                  className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">
                    {selectedUser.firstName && selectedUser.lastName 
                      ? `${selectedUser.firstName} ${selectedUser.lastName}` 
                      : selectedUser.fullName || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="text-sm text-gray-900">{selectedUser.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="text-sm text-gray-900">{selectedUser.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Join Date</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Verified</label>
                  <p className="text-sm text-gray-900">{selectedUser.isEmailVerified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Verified</label>
                  <p className="text-sm text-gray-900">{selectedUser.isPhoneVerified ? 'Yes' : 'No'}</p>
                </div>
                {selectedUser.oauthProvider && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">OAuth Provider</label>
                    <p className="text-sm text-gray-900">{selectedUser.oauthProvider}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Orders</label>
                  <p className="text-sm text-gray-900">{selectedUser.totalOrders || 0}</p>
                </div>
              </div>
              
              {selectedUser.addresses && selectedUser.addresses.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Addresses</h4>
                  <div className="space-y-3">
                    {selectedUser.addresses.map((address, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <p className="text-sm">
                          {address.fullName}<br />
                          {address.addressLine1}<br />
                          {address.addressLine2 && <>{address.addressLine2}<br /></>}
                          {address.city}, {address.state} {address.pincode}<br />
                          Phone: {address.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword('');
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 mb-4">
                Reset password for: {selectedUser.firstName && selectedUser.lastName 
                  ? `${selectedUser.firstName} ${selectedUser.lastName}` 
                  : selectedUser.fullName || selectedUser.email}
              </p>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setNewPassword('');
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                disabled={!newPassword || newPassword.length < 6}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;