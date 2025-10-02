import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";
import { TrophyIcon, StarIcon, FireIcon, AcademicCapIcon, ClockIcon } from "@heroicons/react/24/solid";
import { API_URL } from '../config';

// A small helper component for the progress bar
const ProgressBar = ({ progress }) => (
  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
    <div 
      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

export default function Achievements() {
  const [allAchievements, setAllAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { progress } = useAuth(); // Get user and their progress

  useEffect(() => {
    const fetchAllAchievements = async () => {
      try {
        const response = await fetch(`${API_URL}/api/achievements`);
        const data = await response.json();
        setAllAchievements(data);
      } catch (error) {
        console.error("Failed to fetch achievements list", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllAchievements();
  }, []);

  // Create the stats array dynamically
  const stats = [
    { label: "Total Points", value: progress?.points || 0, icon: StarIcon, color: "text-yellow-400" },
    { label: "Achievements", value: `${progress?.unlockedAchievements?.length || 0}/${allAchievements.length}`, icon: TrophyIcon, color: "text-purple-400" },
    { label: "Learning Streak", value: "12 days", icon: FireIcon, color: "text-orange-400" }, // This is static for now
    { label: "Modules Completed", value: progress?.completedModules?.length || 0, icon: AcademicCapIcon, color: "text-blue-400" }
  ];

  if (isLoading) {
    // ... (loading JSX remains the same)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white">
      <Navbar />
      <div className="pt-20 pb-28">
        {/* === Header and Stats Grid (Rebuilt) === */}
        <div className="text-center mb-16 px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <TrophyIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Your Achievements</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
            Celebrate your learning milestones and track your progress
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mt-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
                  <Icon className={`h-7 w-7 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* === Detailed Achievement Cards (Rebuilt) === */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allAchievements.map((ach) => {
              const isUnlocked = progress?.unlockedAchievements?.includes(ach._id);
              // NOTE: Progress for incomplete achievements is static for now.
              // A more advanced backend would be needed to track this.
              const currentProgress = isUnlocked ? 100 : (ach.criteriaKey === 'FIRST_STEPS' ? 0 : 40);

              return (
                <div key={ach._id} className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                  isUnlocked ? 'border-green-500/50' : 'border-transparent opacity-70 hover:opacity-100'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isUnlocked ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                      <StarIcon className={`h-6 w-6 ${isUnlocked ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                    {isUnlocked && (
                      <div className="text-right">
                        <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Completed</span>
                        <p className="font-bold text-green-600 dark:text-green-400 mt-1">{ach.points} pts</p>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{ach.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-4">{ach.description}</p>
                  
                  <div className="mt-auto space-y-2">
                     <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                        <span>Progress</span>
                        <span>{currentProgress}%</span>
                     </div>
                     <ProgressBar progress={currentProgress} />
                     {isUnlocked ? (
                       <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                         <ClockIcon className="h-4 w-4" />
                         <span>Completed!</span>
                       </div>
                     ) : (
                       <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                         <StarIcon className="h-4 w-4 text-amber-400" />
                         <span>{ach.points} points available</span>
                       </div>
                     )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
     
    </div>
  );
}