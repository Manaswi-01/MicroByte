import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import { API_URL } from '../../config';
import Footer from '../../components/Footer';

export default function AdminDashboard() {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (isAuthLoading) return;
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchModules = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('${API_URL}/api/modules');
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        const data = await response.json();
        setModules(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModules();
  }, [token, isAuthLoading]);

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Are you sure you want to delete this module? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/modules/${moduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete module.');
      }

      setModules(modules.filter(m => m._id !== moduleId));
      
    } catch (err) {
      setError(err.message); // Display delete error
    }
  };

  const renderContent = () => {
    if (isLoading) return <p>Loading modules...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    
    if (modules.length === 0) {
      return <p className="text-slate-500">No modules created yet. Get started by creating one!</p>;
    }

    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
        <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-700">
          {modules.map((module) => (
            <li key={module._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <div>
                <p className="text-lg font-medium text-slate-900 dark:text-white">{module.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{module.category} - {module.level}</p>
              </div>
              <div className="flex gap-4">
                <Link to={`/admin/module/${module._id}/edit`} className="text-indigo-600 hover:text-indigo-800 font-medium">Edit</Link>
                <button 
                  onClick={() => handleDeleteModule(module._id)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <Link 
            to="/admin/modules/new" 
            className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
          >
            Create New Module
          </Link>
        </div>
        {renderContent()}
      </main>
   
    </div>
  );
}