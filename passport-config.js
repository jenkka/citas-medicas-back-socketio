const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Database = require('./src/models/database.model');

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://ma-back.herokuapp.com/api/auth/google/callback",
      passReqToCallback: true
    },
    function(req, token, tokenSecret, profile, done) {
      const newClient = {
        username: profile.id,
        name: profile.name.givenName,
        lastname: profile.name.familyName,
        gender: 'Not specified',
        age: 'Not specified',
        email: profile.emails[0].value,
        password: undefined
      }

      req.created = false;
      req.doctorStatus = false;

      const clients = new Database('clients');
      clients.collection.findOne({ email: newClient.email })
          .then(exists => {
              if (exists) {
                console.log('Client exists in the database.');
                done(null, exists);
                return;
              }

              const doctors = new Database('doctors');
              doctors.collection.findOne({ email: newClient.email })
                .then(doctor => {
                  if (doctor) {
                    console.log('Doctor exists in the database.');
                    req.doctorStatus = true;
                    done(null, doctor);
                    return;
                  }


                  if (req.query.state === 'true') {
                    clients.collection.insertOne(newClient)
                      .then(result => {
                        req.created = true;
                        done(null, newClient);
                        return;
                      });
                  } else {
                    done(null, null);
                    return;
                  }
                })
          });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    // User.findById(id, function(err, user) {
    //   done(err, user);
    // });
    done(null, user);
  });
}
