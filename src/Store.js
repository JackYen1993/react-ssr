import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import users from "./reducers/UserReducer";

const configureStore = (preloadedState = {}) => {
  const reducers = { users };

  // Config enhancers
  const enhancers = [];
  const isDevelopment = process.env.NODE_ENV === 'development';
  // In development, use the browser's Redux dev tools extension if installed
  if (isDevelopment && typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__());
  }

  return createStore(
    combineReducers(reducers),
    preloadedState,
    compose(applyMiddleware(thunk), ...enhancers)
  );
}

export default configureStore;