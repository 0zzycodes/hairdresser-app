import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import * as serviceWorker from './serviceWorker';
import { HashRouter } from 'react-router-dom';
// import ScrollMemory from 'react-router-scroll-memory';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <div>
        {/* <ScrollMemory /> */}
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </div>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);

// serviceWorker.register();
