import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initAnalytics } from './analytics';
import { PreviewProvider } from './context/PreviewContext';
import App from './App.jsx';
import './index.css';

initAnalytics();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PreviewProvider>
      <App />
    </PreviewProvider>
  </StrictMode>
);
