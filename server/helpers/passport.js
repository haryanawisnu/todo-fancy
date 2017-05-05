var User = require('../models/users');
require('dotenv').config()

module.exports = {
  signup: (req, username, password, done) => {
    console.log(password);
    process.nextTick(function() {
      console.log('---');
      User.find({
        'local.username': username
      }, function(err, user) {
        if (err)
          console.log('notfound');
        return done(err);
        if (user) {
          console.log('udah ada');
          return done(err);
        } else {
          console.log('ga ada');
          var newUser = new User();
          newUser.local.username = username;
          newUser.local.password = newUser.generateHash(password);

          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          })
        }
      })

    });
  }
}

// passport.use('local-login', new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback: true
//   },
//   function(req, email, password, done) {
//     process.nextTick(function() {
//       User.findOne({
//         'local.username': email
//       }, function(err, user) {
//         if (err)
//           return done(err);
//         if (!user)
//           return done(null, false, req.flash('loginMessage', 'No User found'));
//         if (!user.validPassword(password)) {
//           return done(null, false, req.flash('loginMessage', 'invalid password'));
//         }
//         return done(null, user);
//
//       });
//     });
//   }
// ));
//
// passport.use(new FacebookStrategy({
//     clientID: process.env.CLIENTID,
//     clientSecret: process.env.CLIENTSECRET,
//     callbackURL: process.env.CALLBACKURL
//   },
//   function(accessToken, refreshToken, profile, done) {
//     process.nextTick(function() {
//       User.findOne({
//         'facebook.id': profile.id
//       }, function(err, user) {
//         if (err)
//           return done(err);
//         if (user)
//           return done(null, user);
//         else {
//           var newUser = new User();
//           newUser.facebook.id = profile.id;
//           newUser.facebook.token = accessToken;
//           newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
//           newUser.facebook.email = profile.emails[0].value;
//
//           newUser.save(function(err) {
//             if (err)
//               throw err;
//             return done(null, newUser);
//           })
//           console.log(profile);
//         }
//       });
//     });
//   }
// ));
