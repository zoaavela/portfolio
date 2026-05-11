import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import App from './App.jsx'
import { LanguageProvider } from './context/LanguageContext'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <LanguageProvider>
                <App />
            </LanguageProvider>
        </BrowserRouter>
    </StrictMode>
)

// Supprimer le loader HTML une fois que React est prêt
const loader = document.getElementById('initial-loader')
if (loader) {
    loader.style.opacity = '0'
    setTimeout(() => loader.remove(), 500)
}