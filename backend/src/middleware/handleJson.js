const express = require('express');

const handleJson = (req, res, next) => {
  express.json({ limit: '50mb' })(req, res, err => {
    if (err) {
      console.log('JSON.parse error: ' + err.message);
      return res.status(400).json({ message: 'Problems parsing JSON.' });
    }
    next();
  });
};

module.exports = handleJson;
