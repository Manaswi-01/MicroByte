import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";


export default function CommunityChat() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Community Chat
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Discuss topics and learn with other members in real-time.
          </p>
        </div>
        
        {/* ChatBox Component */}
        <div className="relative">
          <div className="absolute -inset-1 hidden dark:block bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-2xl blur-2xl"></div>
          <div className="relative">
            <ChatBox />
          </div>
        </div>
      </main>
    </div>
  );
}