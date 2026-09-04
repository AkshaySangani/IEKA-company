import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { Toaster } from 'react-hot-toast';
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <>
    <App />
    <Toaster position="top-center" />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log("PWA is ready for offline use.");
  },

  onUpdate: (registration) => {
    console.log("New version available.");

    if (
      window.confirm(
        "A new version of the application is available. Reload now?"
      )
    ) {
      registration.waiting?.postMessage({
        type: "SKIP_WAITING",
      });

      window.location.reload();
    }
  },
});
