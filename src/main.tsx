import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Disable scroll restoration IMMEDIATELY
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

// NOTE: ScrollToTop lives in src/components/ScrollToTop.tsx and is rendered
// inside <App /> — keep a single instance to avoid double scroll jumps.

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
