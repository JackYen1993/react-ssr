import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { CookieStorage } from 'redux-persist-cookie-storage';
import { persistCombineReducers } from 'redux-persist';
import Cookies from 'cookies-js';
import users from "./reducers/UserReducer";
import auth from "./reducers/AuthReducer";

const configureStore = (preloadedState = {}) => {
  const reducers = {
    auth,
    users
  };

  const persistConfig = {
    key: 'ssr-state',
    storage: new CookieStorage(Cookies, {}),
    whitelist: ['auth']
  };

  const rootReducer = persistCombineReducers(persistConfig, reducers);

  // Config enhancers
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === 'development';
  // In development, use the browser's Redux dev tools extension if installed
  if (isDevelopment && typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__());
  }

  return createStore(
    rootReducer,
    preloadedState,
    compose(applyMiddleware(thunk), ...enhancers)
  );
}

export default configureStore;