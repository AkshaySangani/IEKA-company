import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
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
