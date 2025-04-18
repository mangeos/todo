import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Home, Menu, X, LogOut, HomeIcon } from "lucide-react";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="#">
            <HomeIcon size={48} className="text-blue-500" />
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg focus:outline-none focus:ring"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">


          <Link
            to="/home"
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <Home size={24} />
            <span>Home</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="p-4">
          <button onClick={()=>{
            // Ta bort JWT-token från localStorage
            localStorage.removeItem("jwt");

            // Omdirigera användaren till startsidan eller login-sidan
            window.location.href = "/";
          }} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 w-full">
            <LogOut size={24} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        <header className="p-4 bg-white shadow-md">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg focus:outline-none focus:ring lg:hidden"
          >
            <Menu size={24} />
          </button>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
