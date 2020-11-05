import path from 'path';
import fs from 'fs';

import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from '../src/App';
import store from "../src/Store";

const PORT = process.env.PORT || 3006;
const app = express();

app.use(express.static('./dist', { index: false }));

app.get('*', (req, res) => {
  const app = renderToString(
    <StaticRouter location={req.path}>
      <Provider store={store}>
        <App />
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
        `<div id="root">${app}</div>`
      )
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});