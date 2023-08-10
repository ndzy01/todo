import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Router';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

document.documentElement.addEventListener(
  'touchstart',
  function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  },
  false,
);

let lastTouchEnd = 0;

document.documentElement.addEventListener(
  'touchend',
  function (event) {
    const now = Date.now();

    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }

    lastTouchEnd = now;
  },
  false,
);
