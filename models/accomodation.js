"use strict";

module.exports = function(sequelize, DataTypes) {
  var Accomodation = sequelize.define('accomodation', {
    uuid: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4(),
      },
    price: DataTypes.INTEGER,
    numBeds: DataTypes.INTEGER,
    numReservations: DataTypes.INTEGER,
    name: DataTypes.STRING,
  },
    {
      freezeTableName: true,
      classMethods : {
        associate: function(models){
          Accomodation.belongsTo(models.organization);
        }
      }

    }
  )

  return Accomodation;
};
