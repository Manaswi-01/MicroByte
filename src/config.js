// This will use the VITE_API_URL from your Vercel settings when deployed,
// but will fall back to localhost when you're running it on your own computer.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';