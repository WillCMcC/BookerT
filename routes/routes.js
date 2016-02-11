var Sequelize = require('sequelize')
var models  = require('../models');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var bcrypt = require('bcrypt');
var url = require('url');
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
  var get_params = url.parse(req.url, true).query;
  if (Object.keys(get_params).length == 0){
    models.organization.findAll({
        include: [ models.accomodation ]
      }).then(function(organizations) {
        res.status(200).send(organizations)
      });
  }else{
    var queryobj = {};
    keys = Object.keys(get_params);
    console.log(get_params)

    if(keys[0] == 'uuid'){
      models.organization.find({
        where: {uuid: get_params[keys[0]]},
          include: [ models.accomodation ]
        }).then(function(organizations) {
          res.status(200).send(organizations)
        });
    }
    if(keys[0] == 'orgUrl'){
      models.organization.find({
        where: {orgUrl: get_params[keys[0]]},
          include: [ models.accomodation ]
        }).then(function(organizations) {
          res.status(200).send(organizations)
        });
    }

  }
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
  var newOrg = models.organization.create(req.body).then(function(organizations) {
    var owner = models.user.find({where: {
      uuid: req.user.uuid,
    }}).then(function(owners){
      organizations.setUser(owners),
      res.redirect('/');
    })
  });
});
router.get('/delete/org/:uuid', upload.array(), function(req, res) {
    models.organization.find({where: {
      uuid: req.params.uuid,
    }}).then(function(org){
      org.destroy().then(function(){
        res.redirect('/');
      })
    })
  });


// new accomodations at /api/new/accomodations
router.post('/new/accomodation', upload.array(), function(req, res) {
  // new accomodation
  var newAccomodation = models.accomodation.build({
      numBeds: req.body.numBeds,
      numReservations: req.body.numReservations,
      price: req.body.price,
      name: req.body.name,
  })
  // save and relate to organization
  newAccomodation.save().then(function(){
    models.organization.find({where: {uuid: req.body.orgUUID}}).then(function(org){
      console.log(org)
      newAccomodation.setOrganization(org);
      res.redirect('/org?uuid=' + org.uuid);
    });
  })
})
router.post('/new/rental', upload.array(), function(req, res) {
  // new rental
  var newRental = models.Rental.create(req.body).then(function(gotem){
  // save and relate to organization
    models.accomodation.find({where: {uuid: req.body.accUUID}}).then(function(acc){
      gotem.setAccomodation(acc)
      console.log(gotem.toJSON())
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
    newUser.password = hash;
    newUser.save().then(function(){
      // req.body.username = newUser.email;
      // req.body.password = newUser.password;
      // console.log(req.body)

      passport.authenticate('local', function(err, user, info){


        res.redirect('/')
      })(req, res)

    })

  });

})
//
var viewRoute  = express.Router();

viewRoute.get("/",  function(req, res){
  if(!req.user){
    res.redirect('/login')
  }
  else
    res.sendFile('/public/home.html', { root: __dirname } )
  })
  viewRoute.get("/visit/:org",  function(req, res){
    if(req.params.org){
      res.sendFile('/public/niceOrg.html', { root: __dirname } )
    }
    else
      res.redirect('/')
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
viewRoute.get("/org",  function(req, res){
  models.organization.findAll({
    where:{
      uuid: req.query.org,
    },
      include: [ models.accomodation ]
    }).then(function(organizations) {
      res.sendFile('/public/orgs.html', { root: __dirname } )
    });
})

app.use(viewRoute);

authRouter.post('/login', upload.array(),
function(req, res){
  if(req.user){
    res.send(200)
  }
  else{
    passport.authenticate('local', function(err, user, info){
      res.redirect('/')
    })(req, res)
  }
});
authRouter.get('/acct', upload.array(),
function(req, res){
  if(req.user){
    res.send(req.user)
  }
  else{
    res.redirect('/')
  }
});
authRouter.get('/logout', upload.array(),
function(req, res){
  if(req.isAuthenticated()){
    req.logout();
  }
    res.redirect('/');
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
