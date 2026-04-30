import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, LogOut, Menu, X } from 'lucide-react';

export const Layout = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  ];

  if (user?.role === 'Admin') {
    navItems.push({ name: 'User Management', path: '/users', icon: Users });
  }

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center md:hidden">
        <h1 className="text-xl font-bold">Task Manager</h1>
        <button onClick={toggleSidebar} className="p-2 focus:outline-none">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`bg-white w-64 min-h-screen border-r border-gray-200 flex-shrink-0 transition-transform duration-300 ease-in-out fixed md:static z-20 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 hidden md:block">
            <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">Task Manager</h1>
          </div>
          
          <nav className="flex-1 px-4 mt-6 md:mt-0 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-gray-50">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-10 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden relative">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
