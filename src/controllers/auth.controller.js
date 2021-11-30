const Database = require('../models/database.model');
// const jwt = require('jsonwebtoken');

class AuthController {

    static isAuthenticated(req, res, next) {
      // let token;
      // if (typeof window !== 'undefined') {
      //     token = localStorage.getItem('ma-token');
      // } else {
      //     token = req.headers.auth;
      // }
      //
      // if (!token) {
      //   res.status(401).send('Not authenticated.');
      //   return;
      // }

      next();
    }

    static isAdmin(req, res, next) {
      // let token;
      // if (typeof window !== 'undefined') {
      //     token = localStorage.getItem('ma-token');
      // } else {
      //     token = req.headers.auth;
      // }
      //
      // if (token !== 'admin') {
      //   res.status(403).send('Missing administrator privileges.');
      //   return;
      // }

      next();
    }
}

module.exports = AuthController;
