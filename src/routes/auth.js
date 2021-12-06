const router = require('express').Router();
const passport = require('passport');
const Database = require('../models/database.model');


router.post('/login', function(req, res) {
  const sessions = new Database('sessions');
  sessions.collection.findOne({ _id: req.body.token })
    .then(result => {
      if (result) {
        console.log('result', result)
        let doc = {
          token: result._id
        }

        doc.user = result.user;
        doc.doctorStatus = result.doctorStatus;
      
        console.log('session with token', doc);
        res.status(200).send(doc);
        return;
      }

      const clients = new Database('clients');
      clients.collection.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }] })
        .then(client => {
          if (client) {
            const sess = {
              _id: req.sessionID,
              user: client.username,
              doctorStatus: false
            }

            sessions.collection.insertOne(sess)
              .then(answer => {
                const doc = {
                  token: sess._id,
                  user: sess.user,
                  doctorStatus: sess.doctorStatus
                }
                console.log('client login session', doc);
                res.status(200).send(doc);
                return;
              })
              .catch(err => {
                res.status(500).send();
                return;
              })
          } else {
            const doctors = new Database('doctors');
            doctors.collection.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }] })
              .then(doctor => {
                if (doctor) {
                  const sess = {
                    _id: req.sessionID,
                    user: doctor.username,
                    doctorStatus: true
                  }

                  sessions.collection.insertOne(sess)
                    .then(answer => {
                      const doc = {
                        token: sess._id,
                        user: sess.user,
                        doctorStatus: sess.doctorStatus
                      }
                      console.log('doctor login session', doc);
                      res.status(200).send(doc);
                      return;
                    })
                    .catch(err => {
                      res.statusCode(500);
                      return;
                    })
                } else {
                  res.status(404).send('Client or password is not correct.');
                  return;
                }
              })
          }
        })
    })
});

router.get('/logout/:token', function(req, res) {
  let session = new Database('sessions');
  session.collection.deleteOne({ _id: req.params.token })
    .then(result => {
      if (result.deletedCount > 0) {
        req.logout();
        delete req.session;
        delete req.user;
        res.status(200).send('Logged out.');
        return;
      } else {
        res.status(404).send('No session found.');
        return;
      }
    });
});

router.get('/google', function(req, res, next) {
  passport.authenticate('google', { scope: ['profile', 'email'], state: req.query.signup })(req,res,next);
});

router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'https://mymedicalappointments.herokuapp.com/error'}), (req, res) => {
  let url = 'https://mymedicalappointments.herokuapp.com/login?created=' + req.created;
  if (!req.created) {
    url += '&token=' + req.sessionID + '&doctor=' + req.doctor;
  }
  console.log('redirecting to ', url)
  res.redirect(url);
});

router.get('/token', function(req, res) {
  res.status(200).send(req.sessionID);
});

module.exports = router;
