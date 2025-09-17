import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const Dashboard = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    ordersLast7Days: 0,
    loading: true
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));

      // Fetch users
      const usersResponse = await axios.get(`${BACKEND_URL}/api/admin/users`);
      const totalUsers = usersResponse.data?.data?.users?.length || usersResponse.data?.length || 0;

      // Fetch orders
      const ordersResponse = await axios.get(`${BACKEND_URL}/api/orders`);
      const orders = ordersResponse.data?.data?.orders || ordersResponse.data || [];
      const totalOrders = orders.length;

      // Calculate orders from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const ordersLast7Days = orders.filter(order => {
        const orderDate = new Date(order.createdAt || order.orderDate);
        return orderDate >= sevenDaysAgo;
      }).length;

      // Get recent orders (last 5)
      const sortedOrders = orders
        .sort((a, b) => new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate))
        .slice(0, 5);

      setStats({
        totalUsers,
        totalOrders,
        ordersLast7Days,
        loading: false
      });

      setRecentOrders(sortedOrders);

    } catch (error) {
      console.error('Error fetching dashboard data:', error.response?.data?.message || error.message);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price) => {
    if (!price) return '$0.00';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-semibold">
                {stats.loading ? '...' : stats.totalUsers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-semibold">
                {stats.loading ? '...' : stats.totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Orders (Last 7 Days)</p>
              <p className="text-2xl font-semibold">
                {stats.loading ? '...' : stats.ordersLast7Days}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {stats.loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <div key={order._id || index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium">#{order.orderId || order._id}</p>
                  <p className="text-sm text-gray-500">
                    {order.user?.name || order.customerName || 'Unknown Customer'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(order.createdAt || order.orderDate)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatPrice(order.totalAmount || order.total)}
                  </p>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    {order.status || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;