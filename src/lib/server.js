const express = require('express');
const morgan = require('morgan');

module.exports = (distDirectory) => {
  const app = express();

  app.use(morgan('combined'));
  app.use(express.static(distDirectory, {
    extensions: ['html'],
  }));

  return app;
};
