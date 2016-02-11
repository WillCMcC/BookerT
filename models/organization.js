"use strict";

module.exports = function(sequelize, DataTypes) {
  var Organization = sequelize.define('organization', {
    ownerName: DataTypes.STRING,
    orgUrl: DataTypes.STRING,
    uuid: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1(),
      },
  },
    {
      freezeTableName: true,
      classMethods : {
        associate: function(models){
          Organization.hasMany(models.accomodation);
          Organization.belongsTo(models.user);

        }
      }
     }
  )

  return Organization;
};
