import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './react_todo_day6.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
