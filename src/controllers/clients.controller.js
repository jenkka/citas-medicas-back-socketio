const Database = require('../models/database.model');

class Clients {
  static createClient(req, res) {
      const database = new Database('clients');

      const doc = {
        username: req.body.username,
        name: req.body.name,
        lastname: req.body.lastname,
        gender: req.body.gender,
        age: req.body.age,
        email: req.body.email,
        password: req.body.password
      };

      if (Object.values(doc).includes(undefined || '')) {
        res.status(422).send('Fields are missing.');
        return;
      }

      database.collection.findOne({ $or: [{ email: doc.email }, { username: doc.username }] })
          .then(results => {
              if (results) {
                  if (results.email === doc.email) {
                      res.status(409).send('That email has already been used.');
                      return;
                  }

                  if (results.username === doc.username) {
                      res.status(409).send('That username has already been used.');
                      return;
                  }
              }

              database.collection.insertOne(doc)
                  .then(results => {
                      res.status(200).send('Client has been created.')
                  })
                  .catch(err => {
                      res.status(500).send('There was an error while trying to create the client.');
                  });
          });
  }

  static getAllClients(req, res) {
    const clients = new Database('clients');
    clients.collection.find().toArray((err, results) => {
      if (err) {
        res.status(500).send(err);
      }

      if (results.length === 0) {
        res.status(400).send('No clients found.')
      } else {
        res.status(200).send(results);
      }
    });
  }

  // Gets a client by ID
  static getClient(req, res) {
    const database = new Database('clients');

    database.collection.findOne({ username: req.params.username })
        .then(results => {
            if(results) {
                res.status(200).send(results);
                return;
            } else {
                res.status(404).send('Client not found.');
                return;
            }
        })
        .catch(err => {});
  }

  // Edits the client with the respective ID
  static updateClient(req, res) {
    const database = new Database('clients');

    delete req.body.username;

    let doc = {
      name: req.body.name,
      lastname: req.body.lastname,
      gender: req.body.gender,
      age: req.body.age,
      email: req.body.email,
      password: req.body.password
    }

    Object.keys(doc).forEach(key => {
      if (doc[key] === undefined || doc[key] === '') {
        delete doc[key];
      }
    });

    database.collection.updateOne(
      { username: req.params.username },
      { $set: doc })
      .then(results => {
        if (results.matchedCount <= 0) {
          res.status(404).send('Client not found.');
          return;
        }

        res.status(200).send('Client has been updated.');
        return;
      })
      .catch(err => {
        res.status(500).send(err);
      });
  }

  static deleteClient(req, res) {
    const database = new Database('clients');

    database.collection.deleteOne({ username: req.params.username })
        .then(results => {
          if(results.deletedCount > 0) {
              res.status(200).send('Client has been deleted.');
          } else {
              res.status(404).send('Client not found.');
          }
        })
        .catch(err => {});
  }
}

module.exports = Clients;
