import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { requestPersistentStorage } from './utils/persistentStorage';
import './styles.css';

void requestPersistentStorage();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
