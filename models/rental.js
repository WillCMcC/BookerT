"use strict";

module.exports = function(sequelize, DataTypes) {
  var rental = sequelize.define('rental', {
    uuid: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4(),
      },
    dateRange: DataTypes.STRING,
    email: DataTypes.STRING,
    startDate: DataTypes.STRING,
    endDate: DataTypes.STRING,

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
