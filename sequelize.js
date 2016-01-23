var Sequelize = require('sequelize');

var sequelize = new Sequelize('db',null, null,
{
    dialect: 'sqlite',
    storage: 'db.sqlite',
})



// define organization, highest level
var Organization = sequelize.define('organization', {
  ownerName: Sequelize.STRING,
  uuid: {
      type: Sequelize.UUID,
      primaryKey: true
    },
},
  {freezeTableName: true }
)
//  define accomodation
var Accomodation = sequelize.define('accomodation', {
  uuid: {
      type: Sequelize.UUID,
      primaryKey: true
    },
  price: Sequelize.INTEGER,
  numPeople: Sequelize.INTEGER,
},
  {freezeTableName: true }
)

// set up relationships
Organization.hasMany(Accomodation, {as: 'Rooms'})


Organization.sync().then(function () {
  console.log('made org table')
});

Accomodation.sync().then(function () {
  console.log('made accomodation table')
});


var rawSpa = Organization.build({ownerName: 'Raw Spa', uuid: 6})
var riverHut = Accomodation.build({price: 45, numPeople: 1, uuid:7})

rawSpa.setRooms(riverHut).then(function(){
  rawSpa.save();
  riverHut.save();
  Accomodation.findAll().then(function(accomodations){console.log(accomodations)})
});
