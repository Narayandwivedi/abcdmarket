import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/products/ProductList';
import Users from './pages/Users';
import Orders from './pages/Orders';
import ChatSupport from './pages/ChatSupport';
import Blogs from './pages/Blogs';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import HeroManagement from './pages/HeroManagement';
import ShopCategoryManagement from './pages/ShopCategoryManagement';
import SubCategoryManagement from './pages/SubCategoryManagement';
import './App.css';

function App() {
  return (
    <Router>
      <AppContextProvider>
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<ProductList />} />
            <Route path="/users" element={<Users />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/chat-support" element={<ChatSupport />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/hero-management" element={<HeroManagement />} />
            <Route path="/shop-category-management" element={<ShopCategoryManagement />} />
            <Route path="/sub-category-management" element={<SubCategoryManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </AppContextProvider>
    </Router>
  );
}

export default App;
