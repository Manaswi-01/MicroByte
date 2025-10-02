import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';
import Footer from '../components/Footer';

export default function ModuleViewer() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { token, isLoading: isAuthLoading, fetchProgress } = useAuth();
  
  // Removed moduleData state as it's not needed for the header
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!token) {
      setError("You must be logged in to view this content.");
      setIsLoading(false);
      return;
    }

    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // We still fetch module data from the backend, but we don't store it in state
        const response = await fetch(`${API_URL}/api/lessons/by-module/${moduleId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Could not fetch content.');
        const data = await response.json();
        
        // Only set lessons, not moduleData
        setLessons(data.lessons);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
  }, [moduleId, token, isAuthLoading]);

  const handleMarkAsComplete = async () => {
    try {
      const response = await fetch(`${API_URL}/api/progress/modules/${moduleId}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Could not update progress.');
      
      await fetchProgress(token);
      alert('Module completed! Check your achievements!');
      navigate('/modules');
    } catch (err) {
      alert(err.message);
    }
  };

  const renderContent = () => {
    if (isLoading) return <div className="text-center py-20">Loading content...</div>;
    if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;
    if (lessons.length === 0) return <div className="text-center py-20">No content has been added to this module yet.</div>;
    
    return lessons.map(lesson => (
      <div key={lesson._id} className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{lesson.title}</h2>
        {lesson.content.map((block, index) => {
          switch (block.type) {
            case 'paragraph':
              return <p key={index} className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">{block.value}</p>;
            case 'code':
              return <pre key={index} className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 rounded-md overflow-x-auto my-4"><code>{block.value}</code></pre>;
            case 'video':
              return (
                // Adjusted aspect ratio for a larger player, and removed extra padding
                <div key={index} className="relative w-full pb-[56.25%] overflow-hidden rounded-lg my-4 shadow-lg"> 
                  <iframe 
                    src={`https://www.youtube.com/embed/${block.value}`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full" // iframe takes up full space
                  ></iframe>
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12 w-full flex-grow">
        {/* Removed the header section completely */}
        
        {renderContent()}
        
        {!isLoading && !error && lessons.length > 0 && (
          <button
            onClick={handleMarkAsComplete}
            className="w-full py-3 mt-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
          >
            Mark as Complete
          </button>
        )}
      </main>
    
    </div>
  );
}