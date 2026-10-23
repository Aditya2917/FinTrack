import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Clear any old un-namespaced demo data from previous runs to ensure clean defaults
if (localStorage.getItem('fintrack_transactions')) {
  localStorage.removeItem('fintrack_transactions');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
