var moment = require('moment');
var Sequelize = require('sequelize')
var models  = require('../models');
var methods = {};



methods.validateRental = function(body, res){
  validateObj = {};
  var startString = body.startDate;

  var endString = body.endDate;

  var startArray = startString.split('/');
  var endArray = endString.split('/');
  var start = moment(startArray[0] + " " + startArray[1] + " " + startArray[2], "MM DD YYYY");
  var end = moment(endArray[0] + " " + endArray[1] + " " + endArray[2], "MM DD YYYY");
  var dayCheckArray = []
  var startRef = moment(start);
  while(startRef.format('X') <= end.format('X')){
    dayCheckArray.push(startRef.format('X'))
    startRef = startRef.add(1, 'd')
  }
console.log(dayCheckArray)
  models.accomodation.find({where: {
    uuid: body.accUUID,
  }}).then(function(acc){
    models.rental.findAll({where: {
      accomodationUuid: acc.uuid,
    }}).then(function(rentals){



      var accObj = {};
      var rentalArr = [];

      for(var i = 0 ; i < rentals.length; i++){
          rentalArr.push(rentals[i].dataValues)
      }
      // console.log(rentalArr);
    for(var i=0; i < rentalArr.length; i++){
      // console.log(rentalArr[i])
      newRentalArr = [];
      var rstartString = rentalArr[i].startDate;
      var rendString = rentalArr[i].endDate;
      var rstartArray = rstartString.split('/');
      var rendArray = rendString.split('/');
      var rstart = moment(rstartArray[0] + " " + rstartArray[1] + " " + rstartArray[2], "MM DD YYYY").format('X');
      var rstartRef = moment(moment(rstartArray[0] + " " + rstartArray[1] + " " + rstartArray[2], "MM DD YYYY"));
      var rend = moment(rendArray[0] + " " + rendArray[1] + " " + rendArray[2], "MM DD YYYY").format('X');

      while(rstartRef.format('X') <= rend){
        newRentalArr.push(rstartRef.format('X'));
        rstartRef = rstartRef.add(1, 'd');
      }
      for(var t=0;t<newRentalArr.length;t++){
        if(validateObj[newRentalArr[t]]){
            validateObj[newRentalArr[t]] ++;
        }else{
          validateObj[newRentalArr[t]] = 1;
        }

      }
      // console.log("new: " + newRentalArr)

    }
    for(var i=0;i<dayCheckArray.length;i++){
      if(validateObj[dayCheckArray[i]]){
        if(validateObj[dayCheckArray[i]] < acc.numReservations){
        }else{
          console.log('overbooked: ' + acc.name + ", " + dayCheckArray[i] + ", " + validateObj[dayCheckArray[i]])
          console.log('rental bad')
          res.send('failure')
          return false;
        }
      }else{
      }
    }
    console.log(validateObj);
    console.log('rental good');
    var newRental = models.rental.create(body).then(function(gotem){
    // save and relate to organization
    console.log('saving');
      models.accomodation.find({where: {uuid: body.accUUID}}).then(function(acc){
        gotem.setAccomodation(acc)
        res.send('success')
      });
    })

  })




  })
};

module.exports = methods;
