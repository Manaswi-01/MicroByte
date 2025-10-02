import { useState, useEffect } from "react";
import io from "socket.io-client";
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const socket = io(API_URL);

export default function ChatBox() {
  const [username, setUsername] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (token) {
        try {
          const response = await fetch(`${API_URL}/api/chat/messages`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error("Failed to fetch chat history");
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchHistory();

    socket.on('receiveMessage', (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [token]);

  useEffect(() => {
    if (user?.name) {
      setUsername(user.name);
      setHasJoined(true);
    }
  }, [user]);

  const handleJoin = () => {
    if (username.trim()) {
      setHasJoined(true);
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const messageData = {
      id: Date.now(),
      text: input,
      sender: username,
      createdAt: new Date().toISOString()
    };

    socket.emit('sendMessage', messageData);
    setInput("");
  };

  if (!user && !hasJoined) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl h-[28rem] md:h-[34rem] lg:h-[36rem] flex flex-col items-center justify-center p-8 dark:bg-slate-800/50 dark:border-slate-700">
        <h3 className="text-2xl font-bold mb-4 dark:text-white">Enter your name to join</h3>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
          className="w-full max-w-xs px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white"
          placeholder="Your name..."
        />
        <button
          onClick={handleJoin}
          className="mt-4 px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-lg"
        >
          Join Chat
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl h-[28rem] md:h-[34rem] lg:h-[36rem] flex flex-col dark:bg-slate-800/50 dark:border-slate-700">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-slate-900 font-semibold dark:text-white">Live Chat</h3>
        <p className="text-slate-600 text-sm dark:text-slate-400">Messages are public and real-time</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMyMessage = msg.sender === username;
          return (
            <div key={msg._id || msg.id} className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs px-4 py-2 rounded-xl break-words ${
                  isMyMessage
                    ? "bg-purple-600 text-white rounded-br-none"
                    : "bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white rounded-bl-none"
                }`}>
                {!isMyMessage && (
                  <p className="text-xs font-bold text-purple-600 dark:text-purple-400">{msg.sender}</p>
                )}
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 text-right ${isMyMessage ? 'text-white/70' : 'text-black/50 dark:text-white/50'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}