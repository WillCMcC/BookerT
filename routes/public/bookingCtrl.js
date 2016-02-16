
app.controller('bookingCtrl', function ($scope, $http, $window, $document, $location) {



  $scope.formMessage = ('Book your nights!');
  $scope.validateObj = {};
$http.get('/api/rentals').success(function(data){
    console.log(data)
      $scope.reservations = data;
      for(var i=0; i < $scope.reservations.length; i++){
        // console.log($scope.reservations[i])
        newRentalArr = [];
        var rstartString = $scope.reservations[i].startDate;
        var rendString = $scope.reservations[i].endDate;
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
          if($scope.validateObj[newRentalArr[t]]){
              $scope.validateObj[newRentalArr[t]] ++;
          }else{
            $scope.validateObj[newRentalArr[t]] = 1;
          }

        }
  }
});
  var currentRes = {};
      var datePicker = $('input[name="daterange"]').daterangepicker({
        autoUpdateInput: true,
        isInvalidDate: function(date){
          console.log($scope.currentAcc)
            if(!$scope.validateObj[date.format('X')] || $scope.validateObj[date.format('X')] < 1){
              return false;
            }else{
              return true;
            }

        }
      }, function(start, end, label) {
        var currentDate = moment(start);
        var dayCheckArray = []
        while(currentDate.format('x') < end.format('X')){
          currentDate = currentDate.add(1, 'd')
          dayCheckArray.push(currentDate.format('X'))
        }
        var goodRes = true;
        for(var i=0; i < $scope.reservations.length; i++){
            for(var j=0; j < dayCheckArray.length; j++){
              if($scope.reservations[i].startDate <= dayCheckArray[j] && $scope.reservations[i].endDate >= dayCheckArray[j]){
                $scope.date = {};
                var goodRes = false;
                $scope.formMessage = ('Error: Please choose consecutive dates')
              }
          }
        }
        if(goodRes){

        }else{
        }

      })
      $('#daterange').on('apply.daterangepicker', function(ev, picker) {
        console.log($('#daterange').val())
      });
      $scope.submitThis = function($event, acc){
        console.log(acc)
        $scope.rental.dateRange = $('#daterange').val();
        $scope.rental.accUUID = acc.uuid;
        console.log($('#daterange').val());
        $scope.rental.startDate = $scope.rental.dateRange.slice(0, $scope.rental.dateRange.indexOf('-') - 1)
        $scope.rental.endDate = $scope.rental.dateRange.slice($scope.rental.dateRange.indexOf('-') + 2, $scope.rental.dateRange.length)

        $http.post('/api/new/rental', $scope.rental);
      }



  });
