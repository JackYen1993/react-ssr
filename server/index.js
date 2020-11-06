import path from 'path';
import fs from 'fs';

import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { matchRoutes, renderRoutes } from "react-router-config";
import { CookieStorage, NodeCookiesWrapper } from 'redux-persist-cookie-storage';
import { getStoredState, persistCombineReducers } from 'redux-persist';
import { createStore, applyMiddleware } from "redux";
import Cookies from 'cookies';

import Routes from "../src/Routes";
import thunk from "redux-thunk";
import users from "../src/reducers/UserReducer";
import auth from "../src/reducers/AuthReducer";

const PORT = process.env.PORT || 3006;
const app = express();

app.use(express.static('./dist', { index: false }));

app.get('*', async (req, res) => {
  const cookieJar = new NodeCookiesWrapper(new Cookies(req, res));

  const persistConfig = {
      key: 'ssr-state',
      storage: new CookieStorage(cookieJar),
      stateReconciler(inboundState, originalState) {
          return originalState;
      }
  };

  let preloadedState;
  try {
      preloadedState = await getStoredState(persistConfig);
  } catch (e) {
      preloadedState = {};
  }

  const reducers = {
    auth,
    users
  };

  const rootReducer = persistCombineReducers(persistConfig, reducers);

  const store = createStore(rootReducer, preloadedState, applyMiddleware(thunk));
  res.removeHeader('Set-Cookie');

  const promises = matchRoutes(Routes, req.path).map(({ route }) => {
    const component = route.component;
    return component.getInitialData ? component.getInitialData(store) : null;
  });

  Promise.all(promises).then(() => {
    const app = renderToString(
      <StaticRouter location={req.path}>
        <Provider store={store}>
          {renderRoutes(Routes)}
        </Provider>
      </StaticRouter>
    );

    fs.readFile(path.resolve('./dist/index.html'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Oops, Server error!');
      }

      return res.send(
        data.replace(
          '<div id="root"></div>',
          `<div id="root">${app}</div>
           <script>window.__PRELOADED_STATE__ = ${JSON.stringify(store.getState()).replace(/</g, '\\u003c')}</script>`
        )
      );
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});