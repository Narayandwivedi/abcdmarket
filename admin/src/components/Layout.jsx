import { useState } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 overflow-x-hidden">
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-3 py-2.5 flex items-center justify-between sticky top-0 z-30">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">Admin Panel</p>
          <p className="text-xs text-gray-500">ABCD Market</p>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="lg:ml-64 overflow-auto min-h-screen w-auto bg-gray-100">
        <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6 w-full min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
