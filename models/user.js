"use strict";


module.exports = function(sequelize, DataTypes) {

var User = sequelize.define('user', {
    uuid: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1(),
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,

 },{
    freezeTableName: true,
    classMethods : {
      associate: function(models){
        User.hasMany(models.organization);
      }
    }
}
)
return User;
};
