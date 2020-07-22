import React from 'react';
import ReactDOM from 'react-dom';
import 'react-virtualized/styles.css';
import 'react-virtualized-tree/lib/main.css';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import store from 'reduxState';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
