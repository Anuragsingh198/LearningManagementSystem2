import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/contextFiles/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CourseProvider } from './context/contextFiles/CourseContext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AuthProvider>
    <CourseProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </CourseProvider>
    </AuthProvider>
  // </StrictMode>,
)
