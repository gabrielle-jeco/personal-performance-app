import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import PWAPrompt from './PWAPrompt.tsx'
import OfflineAlert from './OfflineAlert.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OfflineAlert />
    <App />
    <PWAPrompt />
  </StrictMode>,
)
