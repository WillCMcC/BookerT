var Sequelize = require('sequelize')
var models  = require('../models');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var bcrypt = require('bcrypt');
var upload = multer(); // for parsing multipart/form-data
var cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var session = require('express-session')

app.use(session({
  secret: 'test'
}))

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


// passport initialization
app.use(passport.initialize());
app.use(passport.session());

 // passport config

passport.use(new LocalStrategy( {
  passReqToCallback: true,
  usernameField: 'email',
},
  function(req, username, password, done) {
    console.log(req.body)
    console.log(username)
    console.log(password)

    /* get the username and password from the input arguments of the function */

    // query the user from the database
    // don't care the way I query from database, you can use
    // any method to query the user from database
    models.user.find({where:{
      email: username
    }}).then(function(user){
        // console.log(hash + ":" + user.password)
        if(!user)
          // if the user is not exist
          return done(null, false, {message: "The user is not exist"});
        else if(!bcrypt.compareSync(req.body.password, user.password))
          // if password does not match
          return done(null, false, {message: "Wrong password"});
        else
          // if everything is OK, return null as the error
          // and the authenticated user
          req.login(user,function(err){
                  if(err){
                      return next(err);
                  }
                  return done(null,user);
              });
          console.log("login success");
  }).error(function(err){
    // if command executed with error
    return done(err);
  });
}))

passport.serializeUser( function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});







//api routing
var router  = express.Router();




//  return all origanizations at /api/organizations
router.get('/organizations', function(req, res) {
  models.organization.findAll({
      include: [ models.accomodation ]
    }).then(function(organizations) {
      res.status(200).send(organizations)
    });
});

//  return all accomodations at /api/accomodations
router.get('/accomodations', function(req, res) {
  models.accomodation.findAll({
    }).then(function(accomodations) {
      res.status(200).send(accomodations)
    });
});

// new organizations at /api/new/organization
router.post('/new/organization', upload.array(), function(req, res) {
  models.organization.create(req.body).then(function(organizations) {
    res.sendStatus(200);
  });
});

// new accomodations at /api/new/accomodations
router.post('/new/accomodation', upload.array(), function(req, res) {
  // new accomodation
  var newAccomodation = models.accomodation.build({
      numPeople: req.body.numPeople,
      price: req.body.price,
  })
  // save and relate to organization
  newAccomodation.save().then(function(){
    models.organization.find({where: {uuid: req.body.orgUUID}}).then(function(org){
      newAccomodation.setOrganization(org);
      res.sendStatus(200);
    });
  })
})
// app use api router
app.use('/api', router)

var authRouter  = express.Router();

authRouter.post("/new/user", upload.array(), function(req, res){
  // console.log(req.body)
  var newUser = models.user.build({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  })

  bcrypt.hash(req.body.password, 8, function(err, hash) {
    console.log('hash')
    newUser.password = hash;
    newUser.save().then(function(){
      // req.body.username = newUser.email;
      // req.body.password = newUser.password;
      // console.log(req.body)

      passport.authenticate('local', function(err, user, info){
        console.log(err);
        console.log(user);
        console.log(info);

        res.redirect('/')
      })(req, res)

    })

  });

})
//
var viewRoute  = express.Router();

viewRoute.get("/",  function(req, res){
  console.log(req.user)
  if(!req.user){
    res.redirect('/login')
  }
  else
    res.sendFile('/public/home.html', { root: __dirname } )
  })


viewRoute.get("/login",  function(req, res){
  if(!req.user){
    res.sendFile('/public/login.html', { root: __dirname } )
  }if(req.user){
    res.redirect('/')
  }
})
viewRoute.get("/signup",  function(req, res){
  if(!req.user){
    res.sendFile('/public/signUp.html', { root: __dirname } )
  }if(req.user){
    res.redirect('/')
  }
})

app.use( viewRoute);

authRouter.post('/login', upload.array(),
function(req, res){
  console.log(req.body);
  if(req.user){
    console.log('already logged in')
    res.send(200)
  }
  else{
    passport.authenticate('local', function(err, user, info){
      console.log(err);
      console.log(user);
      console.log(info);
      res.redirect('/')
    })(req, res)
  }
});

app.use('/auth', authRouter);

app.use(express.static(__dirname + '/public'));

app.use(function(req,res,next){
  var datenTime = new Date();
  var dateString = datenTime.getMonth() + "/" + datenTime.getDate() + " at " +
    datenTime.getHours() + ":" + datenTime.getMinutes()
      + "." + datenTime.getSeconds();
  console.log('Route Call to ' + req.url + " at "+ dateString + " from " + req.ip);
  next();
});

module.exports = app;
