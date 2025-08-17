import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from './store.jsx';
import AppRouter from './router.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider>
      <AppRouter/>
    </Provider>
  </React.StrictMode>
);
