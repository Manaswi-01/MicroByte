import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { 
  CodeBracketIcon, 
  UserGroupIcon, 
  PaintBrushIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from "@heroicons/react/24/solid";

const categoryIcons = {
  Programming: CodeBracketIcon,
  "Soft Skills": UserGroupIcon,
  Design: PaintBrushIcon,
};

export default function Modules() {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, progress } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/modules');
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
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center py-40">Loading modules...</div>;
    }
    if (error) {
      return <div className="text-center py-40 text-red-500">Error: {error}</div>;
    }
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => {
            // --- THIS IS THE FIX ---
            const isCompleted = isAuthenticated && progress?.completedModules?.includes(module._id);
            
            const Icon = categoryIcons[module.category] || CodeBracketIcon;

            return (
              <div key={module._id} className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md h-full flex flex-col transition-all duration-300 ${isCompleted ? 'border-2 border-green-500' : 'hover:shadow-lg hover:-translate-y-1'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-xl">
                     <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                   <span className={`px-3 py-1 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300`}>
                    {module.level}
                  </span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{module.title}</h3>
                    {isCompleted && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{module.description}</p>
                </div>
                <button
                  onClick={() => navigate(`/modules/${module._id}`)}
                  className={`mt-6 w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${isCompleted ? 'bg-green-600 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                  <span className="h-5 w-5">
                    {isCompleted ? <CheckCircleIcon /> : <ArrowRightIcon />}
                  </span>
                  <span>{isCompleted ? 'Review' : 'Start Learning'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white">
      <Navbar />
      <div className="pt-20 pb-28">
        <div className="relative pb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Learning Modules</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Discover experiences to grow your skills.</p>
        </div>
        {renderContent()}
      </div>

    </div>
  );
}