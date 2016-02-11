console.log('loading')
$(document).ready(function(){
$(function(){
  $('input[name="daterange"]').daterangepicker({
  autoUpdateInput: true,
  isInvalidDate: function(date){
    for(var i=0; i< $scope.reservations.length; i++){
      if($scope.reservations[i].startDate <= date.format('X') && $scope.reservations[i].endDate >= date.format('X')){
        return true;
      }
    }
    return false;
  }
}, function(start, end, label) {
  var startRef = start.format('X');
  var currentDate = start;
  var dayCheckArray = []
  while(currentDate.format('X') < end.format('X')){
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
    $scope.reservations.push({
      startDate: startRef,
      endDate: end.format('X'),
    })
    $scope.date =   $scope.reservations[$scope.reservations.length - 1];
    console.log($scope.date)
  }else{
  }

})
$('#daterange').on('apply.daterangepicker', function(ev, picker) {
  console.log($('#daterange').val())
  $scope.date = picker;
});
});
});
