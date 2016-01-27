var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    // set the field name here
    usernameField: 'email',
    passwordField: 'password'
  },
  function(req, username, password, done) {
    /* get the username and password from the input arguments of the function */

    // query the user from the database
    // don't care the way I query from database, you can use
    // any method to query the user from database

    console.log(req.body)
    models.user.find({where:{
      email: username
    }}).then(function(user){
      bcrypt.hash(req.body.password, 8, function(err, hash) {
        console.log('hash')
        if(!user)
          // if the user is not exist
          return done(null, false, {message: "The user is not exist"});
        else if(!hash == user.password)
          // if password does not match
          return done(null, false, {message: "Wrong password"});
        else
          // if everything is OK, return null as the error
          // and the authenticated user
          return done(null, user);
      }).error(function(err){
        // if command executed with error
        return done(err);
      });
    })

}
)
)

passport.serializeUser( function(user, done) {
  return done(null, user);
});

passport.deserializeUser( function(user, done) {
  models.user.find({where:{
    email: username
  }}).then(function(user){
    bcrypt.hash(req.body.password, 8, function(err, hash) {
      console.log('hash')
      if(!user)
        // if the user is not exist
        return done(null, false, {message: "The user is not exist"});
      else if(!hash == user.password)
        // if password does not match
        return done(null, false, {message: "Wrong password"});
      else
        // if everything is OK, return null as the error
        // and the authenticated user
        return done(null, user);
    }).error(function(err){
      // if command executed with error
      return done(err);
    });
  })
});


module.exports = passport;
