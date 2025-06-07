import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// Link for Remix icons
import "remixicon/fonts/remixicon.css";

// Expose environment variables for debugging
(window as any).__ENV__ = {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
  BASE_URL: import.meta.env.BASE_URL
};

console.log('Environment Variables (accessible via __ENV__):', (window as any).__ENV__);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
