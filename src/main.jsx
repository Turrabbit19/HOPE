import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import Router from './routes/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
      <RouterProvider router={Router} />
    
  </StrictMode>
)
