import { createStore } from 'redux';
import rootReducer from 'reduxState/reducers';

export type RootState = ReturnType<typeof rootReducer>;

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__?: any;
    }
}

const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__?.());
export default store;
