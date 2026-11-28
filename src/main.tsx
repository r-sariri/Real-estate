import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/base.css';
import App from './App';
import './styles/rtl.css';
import './styles/theme.css';

const container = document.getElementById('root');

if (!container) throw new Error('Root element not found');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
