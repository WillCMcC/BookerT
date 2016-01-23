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
var Accomodation - sequelize.define('accomodation', {
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
