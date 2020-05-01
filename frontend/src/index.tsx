import React from 'react';
import ReactDOM from 'react-dom';
import 'react-virtualized/styles.css';
import 'react-virtualized-tree/lib/main.css';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import store from './redux/store/index';

import { GlobalStateProvider } from './utils/GlobalStateContext';

ReactDOM.render(
    <GlobalStateProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </GlobalStateProvider>,
    document.getElementById('root')
);

serviceWorker.unregister();
