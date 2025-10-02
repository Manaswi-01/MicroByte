import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Import Components & Utils
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import AdminRoute from "./components/utils/AdminRoute";

// Import Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Achievements from "./pages/Achievements";
import Modules from "./pages/Modules";
import CommunityChat from "./pages/CommunityChat";
import ModuleViewer from "./pages/ModuleViewer"; // Added this import
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateModule from "./pages/admin/CreateModule";
import EditModule from "./pages/admin/EditModule";

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-white dark:bg-slate-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Private User Routes */}
            <Route path="/modules" element={<ProtectedRoute><Modules /></ProtectedRoute>} />
            <Route path="/modules/:moduleId" element={<ProtectedRoute><ModuleViewer /></ProtectedRoute>} />
            <Route path="/achievements" element={<ProtectedRoute><Achievements /></ProtectedRoute>} />
            <Route path="/community-chat" element={<ProtectedRoute><CommunityChat /></ProtectedRoute>} />
            
            {/* Private Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/modules/new" element={<AdminRoute><CreateModule /></AdminRoute>} />
            <Route path="/admin/module/:moduleId/edit" element={<AdminRoute><EditModule /></AdminRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;