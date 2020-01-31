import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
// import ScrollMemory from 'react-router-scroll-memory';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
require('./ably');

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        {/* <ScrollMemory /> */}
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// serviceWorker.register();
