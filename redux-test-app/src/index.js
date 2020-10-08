import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ReactReduxContext } from 'react-redux';
import App from './App';
import * as serviceWorker from './serviceWorker';
import storeFactory from './storeFactory';
import connectApp from './connectApp';
import CarpentrListener from './CarpentrListener';

const { store, actions } = storeFactory();
const ConnectedApp = connectApp(App, store, actions);

ReactDOM.render(
  <React.StrictMode>
    <ReactReduxContext.Provider value={{ store }}>
      <CarpentrListener store={store} actions={actions}>
        <ConnectedApp />
      </CarpentrListener>
    </ReactReduxContext.Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
