import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './styles/library.css'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'
import { DialogProvider } from './components/Dialog'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('The application root element was not found.')
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <DialogProvider>
        <App />
      </DialogProvider>
    </ThemeProvider>
  </StrictMode>,
)
