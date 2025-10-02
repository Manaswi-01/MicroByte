// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Badge from "../components/Badge";
import { useLocation, Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  CodeBracketIcon,
  ChatBubbleBottomCenterIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/solid";


export default function Home() {
 
   const location = useLocation();
  const [message, setMessage] = useState(location.state?.message);

   useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Optional: clear the state from the location so the message doesn't reappear on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location]);

  // This effect will make the message disappear after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      // Cleanup the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [message]);

  const features = [
    {
      title: "Guided Learning Paths",
      description: "Curated paths from fundamentals to advanced topics, ensuring a structured journey.",
      icon: AcademicCapIcon,
      color: "indigo",
      stats: "50+ Paths",
    },
    {
      title: "Real-world Problems",
      description: "Apply your knowledge to problems inspired by real technical interviews.",
      icon: CodeBracketIcon,
      color: "blue",
      stats: "200+ Problems",
    },
    {
      title: "Interactive Visualizations",
      description: "See data structures in action. Manipulate arrays, traverse trees, and more.",
      icon: ChatBubbleBottomCenterIcon,
      color: "green",
      stats: "100+ Visuals",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Navbar />
      
      {/* --- THIS IS THE NEW PART --- */}
      {message && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 fixed top-20 right-5 z-50 animate-pulse">
          <p className="font-bold">Access Denied</p>
          <p>{message}</p>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-28 md:pt-32 pb-24 overflow-hidden">
        {/* Background Elements for dark mode only */}
        <div className="absolute inset-0 dark:block hidden bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-cyan-900/20" />
        <div className="absolute top-20 left-10 w-72 h-72 dark:block hidden bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 dark:block hidden bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Main Heading */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight transition-colors">
                Unlock Your
                <span className="block text-purple-600 dark:text-purple-400">Tech Potential</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed transition-colors">
                Master complex Computer Science and AI concepts through bite-sized,
                <span className="font-semibold text-purple-600 dark:text-indigo-300"> interactive learning experiences</span>{" "}
                designed for modern learners.
              </p>
            </div>

            {/* Primary CTA only */}
            <div className="flex justify-center mb-4">
              <Link
                to="/login"
                className="group px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl text-lg shadow-lg hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-3 dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-600"
              >
                <RocketLaunchIcon className="h-6 w-6 group-hover:animate-bounce" />
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">
              Why Choose
              <span className="block text-purple-600 dark:text-purple-400">MicroByte?</span>
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto transition-colors">
              Our platform combines cutting-edge technology with proven learning methodologies
              to deliver an unparalleled educational experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="group relative">
                  {/* Card background glow for dark mode */}
                  <div className="absolute inset-0 dark:block hidden bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  
                  <div className="relative bg-white border border-gray-200 rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-1 dark:bg-slate-800/50 dark:border-slate-700 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg dark:bg-gradient-to-br dark:from-indigo-500 dark:to-purple-600">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <Badge label={feature.stats} variant="default" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}