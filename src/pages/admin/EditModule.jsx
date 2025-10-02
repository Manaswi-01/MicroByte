import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function EditModule() {
  const [moduleData, setModuleData] = useState({ title: '', description: '', category: '', level: '' });
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({ title: '', paragraph: '', videoId: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const { token, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { moduleId } = useParams();

  useEffect(() => {
    if (isAuthLoading) return;
    if (!token) {
      setError("You must be logged in as an admin to view this page.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/api/lessons/by-module/${moduleId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch module content.');
        
        const data = await response.json();
        setModuleData(data.module);
        setLessons(data.lessons);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [moduleId, token, isAuthLoading]);

  const handleModuleInputChange = (e) => {
    setModuleData({ ...moduleData, [e.target.name]: e.target.value });
  };
  
  const handleLessonInputChange = (e) => {
    setNewLesson({ ...newLesson, [e.target.name]: e.target.value });
  };

  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/modules/${moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(moduleData)
      });
      if (!response.ok) throw new Error('Failed to update module.');
      alert('Module updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!newLesson.title.trim()) return;

    const content = [];
    if (newLesson.paragraph.trim()) {
      content.push({ type: 'paragraph', value: newLesson.paragraph });
    }
    if (newLesson.videoId.trim()) {
      content.push({ type: 'video', value: newLesson.videoId });
    }

    try {
      const response = await fetch('http://localhost:8000/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: newLesson.title,
          module: moduleId,
          order: lessons.length + 1,
          content: content
        })
      });
      if (!response.ok) throw new Error('Failed to create lesson.');
      
      const createdLesson = await response.json();
      setLessons([...lessons, createdLesson]);
      setNewLesson({ title: '', paragraph: '', videoId: '' });
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      const response = await fetch(`http://localhost:8000/api/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete lesson.');
      setLessons(lessons.filter(l => l._id !== lessonId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="text-center py-24">Loading module editor...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-24">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Edit Module</h1>
            <Link to="/admin/dashboard" className="text-purple-600 hover:underline">← Back to Dashboard</Link>
        </div>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">{error}</div>}

        <form onSubmit={handleModuleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 space-y-6">
           <h3 className="text-xl font-semibold border-b border-slate-200 dark:border-slate-700 pb-2">Module Details</h3>
           <div>
            <label htmlFor="title" className="block text-sm font-medium">Title</label>
            <input type="text" name="title" id="title" value={moduleData.title} onChange={handleModuleInputChange} className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">Description</label>
            <textarea name="description" id="description" rows="3" value={moduleData.description} onChange={handleModuleInputChange} className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700" required></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select name="category" id="category" value={moduleData.category} onChange={handleModuleInputChange} className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600">
                <option>Programming</option>
                <option>Design</option>
                <option>Soft Skills</option>
              </select>
            </div>
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Level</label>
              <select name="level" id="level" value={moduleData.level} onChange={handleModuleInputChange} className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700 dark:border-slate-600">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={isSaving} className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50">
              {isSaving ? 'Saving...' : 'Save Module Changes'}
            </button>
          </div>
        </form>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Lessons</h2>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow mb-6">
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {lessons.map(lesson => (
                <li key={lesson._id} className="px-6 py-4 flex items-center justify-between">
                  <p>{lesson.order}. {lesson.title}</p>
                  <button onClick={() => handleDeleteLesson(lesson._id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                </li>
              ))}
              {lessons.length === 0 && <li className="px-6 py-4 text-slate-500">No lessons yet.</li>}
            </ul>
          </div>
          <form onSubmit={handleAddLesson} className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 space-y-4">
            <h3 className="text-xl font-semibold">Add New Lesson</h3>
            <div>
              <label htmlFor="lessonTitle" className="block text-sm font-medium">Lesson Title</label>
              <input type="text" name="title" id="lessonTitle" value={newLesson.title} onChange={handleLessonInputChange} className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700" required />
            </div>
            <div>
              <label htmlFor="paragraph" className="block text-sm font-medium">Paragraph Content(Optional)</label>
              <textarea name="paragraph" id="paragraph" value={newLesson.paragraph} onChange={handleLessonInputChange} rows="4" className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700"></textarea>
            </div>
            <div>
              <label htmlFor="videoId" className="block text-sm font-medium">YouTube Video ID </label>
              <input type="text" name="videoId" id="videoId" value={newLesson.videoId} onChange={handleLessonInputChange} className="mt-1 block w-full rounded-md border-slate-300 dark:bg-slate-700" placeholder="e.g., dQw4w9WgXcQ" />
            </div>
            <div className="text-right">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Add Lesson</button>
            </div>
          </form>
        </div>
      </main>
  
    </div>
  );
}