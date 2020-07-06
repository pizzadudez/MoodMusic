const express = require('express');

const handleJson = (req, res, next) => {
  express.json()(req, res, err => {
    if (err) {
      console.log('JSON.parse error: ' + err.message);
      return res.sendStatus(400);
    }
    next();
  });
};

module.exports = handleJson;