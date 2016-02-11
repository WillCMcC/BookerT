"use strict";

module.exports = function(sequelize, DataTypes) {
  var rental = sequelize.define('Rental', {
    uuid: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4(),
      },
    startDate: DataTypes.INTEGER,
    endDate: DataTypes.INTEGER,
    email: DataTypes.STRING,
  },
    {
      freezeTableName: true,
      classMethods : {
        associate: function(models){
          rental.belongsTo(models.accomodation);
        }
      }

    }
  )

  return rental;
};
