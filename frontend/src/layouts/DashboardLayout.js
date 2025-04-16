import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SpaceBackground from '../components/SpaceBackground';
import { 
  FiHome, 
  FiCheckSquare, 
  FiCalendar, 
  FiUser, 
  FiSettings, 
  FiMenu, 
  FiX, 
  FiLogOut,
  FiSearch,
  FiBell
} from 'react-icons/fi';

const DashboardLayout = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New task assigned to you', read: false },
    { id: 2, text: 'Meeting in 30 minutes', read: false },
    { id: 3, text: 'Project deadline tomorrow', read: true }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { path: '/dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
    { path: '/tasks', icon: <FiCheckSquare size={20} />, label: 'Tasks' },
    { path: '/calendar', icon: <FiCalendar size={20} />, label: 'Calendar' },
    { path: '/profile', icon: <FiUser size={20} />, label: 'Profile' },
    { path: '/settings', icon: <FiSettings size={20} />, label: 'Settings' }
  ];

  return (
    <SpaceBackground>
      <div className="flex h-screen">
        {/* Sidebar for desktop */}
        <aside 
          className={`glass-dark fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
            isSidebarOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full'
          } ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:flex flex-col ${isSidebarOpen ? '' : 'lg:hidden'}`}
        >
          <div className="flex items-center justify-center h-16 bg-primary bg-opacity-30">
            <Link to="/dashboard" className="text-white text-xl font-bold">Task Manager</Link>
          </div>
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
              >
                <FiLogOut size={20} />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar */}
        <aside 
          className={`glass-dark fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between h-16 bg-primary bg-opacity-30 px-4">
            <Link to="/dashboard" className="text-white text-xl font-bold">Task Manager</Link>
            <button 
              onClick={toggleMobileSidebar}
              className="text-white focus:outline-none"
            >
              <FiX size={24} />
            </button>
          </div>
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
              >
                <FiLogOut size={20} />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
            onClick={toggleMobileSidebar}
          ></div>
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header className="glass-dark shadow-sm z-10">
            <div className="flex items-center justify-between h-16 px-4">
              <div className="flex items-center">
                <button
                  onClick={toggleMobileSidebar}
                  className="text-white hover:text-primary-light focus:outline-none lg:hidden transition-all duration-300 transform hover:scale-110 active:scale-95"
                >
                  <FiMenu size={24} />
                </button>
                <button
                  onClick={toggleSidebar}
                  className="ml-4 text-white hover:text-primary-light focus:outline-none hidden lg:block transition-all duration-300 transform hover:scale-110 active:scale-95"
                >
                  <FiMenu size={24} />
                </button>
                <div className="relative ml-4 md:ml-6">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="text-white text-opacity-70" />
                  </div>
                  <input
                    type="text"
                    className="glass pl-10 pr-4 py-2 w-full md:w-64 text-sm text-white placeholder-white placeholder-opacity-70 border-none focus:ring-2 focus:ring-primary"
                    placeholder="Search tasks..."
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="relative">
                  <button
                    onClick={toggleNotifications}
                    className="p-2 text-white rounded-full hover:bg-white hover:bg-opacity-10 focus:outline-none relative transition-all duration-300"
                  >
                    <FiBell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 glass-dark rounded-md shadow-lg overflow-hidden z-50">
                      <div className="py-2 px-3 bg-primary bg-opacity-20 flex justify-between items-center">
                        <span className="text-sm font-medium text-white">Notifications</span>
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-primary-light hover:text-white"
                        >
                          Mark all as read
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 border-b border-gray-700 ${
                                !notification.read ? 'bg-primary bg-opacity-20' : ''
                              }`}
                            >
                              <p className="text-sm text-white">{notification.text}</p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-white text-opacity-70">
                            No notifications
                          </div>
                        )}
                      </div>
                      <a
                        href="#"
                        className="block py-2 text-center text-sm text-primary-light hover:text-white"
                      >
                        View all notifications
                      </a>
                    </div>
                  )}
                </div>
                <div className="ml-4 relative">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary bg-opacity-20 flex items-center justify-center text-white font-bold text-sm border-2 border-primary-light">
                      {currentUser?.username ? currentUser.username.substring(0, 2).toUpperCase() : 'U'}
                    </div>
                    <span className="ml-2 text-sm font-medium text-white hidden md:block">
                      {currentUser?.username || 'User'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-4 glass-dark bg-opacity-10">
            <Outlet />
          </main>
        </div>
      </div>
    </SpaceBackground>
  );
};

export default DashboardLayout;
