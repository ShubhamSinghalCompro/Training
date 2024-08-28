import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import App from './App';
import { Provider } from 'react-redux';
import store from './store/index'; // Adjust the import path as needed

// Create a root element for the application
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the App component
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);