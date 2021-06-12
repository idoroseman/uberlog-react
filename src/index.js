import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './components/App';
import Firebase, { FirebaseContext } from './components/Firebase';

import reportWebVitals from './reportWebVitals';

// based on
// https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial

ReactDOM.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={new Firebase()}>
      <App />
    </FirebaseContext.Provider>,
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
