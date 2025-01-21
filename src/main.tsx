import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppTheming from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppTheming />
  </StrictMode>,
)
