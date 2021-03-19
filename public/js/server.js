  
/* eslint-disable global-require */
(function() {
  const express = require('express');
  const app = express();

  const server = app.listen(5000, function() {
    console.log(`Express server listening on port ${server.address().port}`);
  });
  module.exports = app;
})();