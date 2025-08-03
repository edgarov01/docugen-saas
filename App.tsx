
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './components/auth/LoginPage';
import DashboardPage from './components/dashboard/DashboardPage';
import TemplateManagementPage from './components/templates/TemplateManagementPage';
import DocumentGenerationPage from './components/generation/DocumentGenerationPage';
import GeneratedDocumentsPage from './components/documents/GeneratedDocumentsPage';
import { TemplateProvider } from './hooks/useTemplates';
import { GenerationProvider } from './hooks/useGeneration';
import { MenuIcon, XIcon, UserCircleIcon, DocumentTextIcon, CogIcon, CollectionIcon, HomeIcon, LogoutIcon } from './components/ui/Icons'; // Assuming Icons.tsx for SVGs

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TemplateProvider>
        <GenerationProvider>
          <MainApp />
        </GenerationProvider>
      </TemplateProvider>
    </AuthProvider>
  );
};

const MainApp: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false); // Close sidebar on route change
  }, [location]);

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <HomeIcon className="w-5 h-5" /> },
    { name: 'Templates', path: '/templates', icon: <CollectionIcon className="w-5 h-5" /> },
    { name: 'Generate Documents', path: '/generate', icon: <DocumentTextIcon className="w-5 h-5" /> },
    { name: 'My Documents', path: '/documents', icon: <CogIcon className="w-5 h-5" /> }, // Replaced cog with a more suitable one if available or kept generic
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-800 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block`}>
        <div className="p-4 flex items-center justify-between h-16 border-b border-slate-700">
          <h1 className="text-2xl font-semibold text-sky-400">DocuGen</h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-300 hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors duration-200 ${location.pathname === item.path ? 'bg-slate-700 text-white border-l-4 border-sky-400' : ''}`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
           <div className="flex items-center mb-2">
            <UserCircleIcon className="w-8 h-8 text-slate-400" />
            <span className="ml-2 text-sm text-slate-300">{user.email}</span>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md transition-colors duration-200"
          >
            <LogoutIcon className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white shadow-md flex items-center justify-between px-6 md:justify-end">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 focus:outline-none md:hidden">
            <MenuIcon className="w-6 h-6" />
          </button>
          <div className="hidden md:block">
            {/* Can add user profile, notifications here */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/templates" element={<TemplateManagementPage />} />
            <Route path="/generate" element={<DocumentGenerationPage />} />
            <Route path="/documents" element={<GeneratedDocumentsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
