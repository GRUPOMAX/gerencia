import React from 'react';
import ReactDOM from 'react-dom'; // ✅ React 17 (correto)
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // ✅ Forma correta para React 17
);
