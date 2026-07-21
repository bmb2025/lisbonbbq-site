import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { initAnalytics, getPostHogInstance } from './services/analytics';
import { patchDomForTranslation } from './services/domSafety';
import { PostHogErrorBoundary, PostHogProvider } from '@posthog/react';

// Run before React mounts so the removeChild/insertBefore guards are in place
// before any commit — otherwise a page-translator DOM mutation can crash the SPA.
patchDomForTranslation();
initAnalytics();

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element to mount to");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <PostHogProvider client={getPostHogInstance()}>
      <PostHogErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PostHogErrorBoundary>
    </PostHogProvider>
  </React.StrictMode>
);