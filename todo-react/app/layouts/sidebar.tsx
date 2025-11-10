import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { Home, Menu, X, LogOut, HomeIcon, User } from "lucide-react";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    extractUsernameFromToken();
  }, []);

  const extractUsernameFromToken = () => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.sub || "User");
      } catch (error) {
        console.error("Error extracting username from token:", error);
        setUsername("User");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <Link to="#" className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-xl shadow-lg">
              <HomeIcon size={32} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              TodoApp
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full">
              <User size={16} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Inloggad som</p>
              <p className="font-semibold text-blue-600 dark:text-blue-400">{username}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <Link
            to="/home"
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
          >
            <Home size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Home</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-6 right-6">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 w-full group"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
            >
              <Menu size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <User size={16} className="text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {username}
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}