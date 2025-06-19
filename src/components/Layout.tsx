
import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Users, FileText, Plus, LogOut, Shield } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '@/components/ui/button';

const Layout = () => {
  const location = useLocation();
  const { logout, currentUser } = useAppStore();

  const handleLogout = () => {
    logout();
  };

  const navigation = [
    { name: 'חיילים', href: '/soldiers', icon: Users },
    { name: 'בקשות', href: '/requests', icon: FileText },
    { name: 'בקשה חדשה', href: '/new-request', icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-reverse space-x-4">
              <Shield className="h-8 w-8" />
              <h1 className="text-xl font-bold">מערכת ניהול חיילים</h1>
            </div>
            
            <div className="flex items-center space-x-reverse space-x-4">
              <span className="text-sm">שלום, {currentUser}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-blue-800"
              >
                <LogOut className="h-4 w-4 ml-2" />
                התנתק
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-blue-800 border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-reverse space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-4 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white border-b-2 border-blue-300'
                      : 'text-blue-200 hover:text-white hover:bg-blue-700'
                  }`}
                >
                  <Icon className="h-4 w-4 ml-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
