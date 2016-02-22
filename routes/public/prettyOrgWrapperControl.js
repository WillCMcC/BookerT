
app.controller('orgWrapperCtrl', function ($scope, $http, $window, $document, $location) {

      var url = $location.absUrl().split('/')
      $scope.title = "Organizations"


      if(url.length > 1){
      var theUrl = url[url.length -1]
      $http.get('/api/organizations?orgUrl=' + theUrl)
        .success(function(data, status, headers, config) {
          $scope.org = data[0];
          console.log(data[0])
        })
      }

      $scope.calShow = function(index){
        for(var i = 0; i < $scope.org.accomodations.length; i++){
            if(i == index){
              $scope.org.accomodations[i].showCal = !$scope.org.accomodations[i].showCal;
            }else{
              $scope.org.accomodations[i].showCal = false;
            }
        }
      }
      // closeAll($scope.org)
      // function closeAll(org){
      //   console.log(org)
      //   for(var i = 0; i < org.accomodations.length; i++){
      //     console.log(org.accomodations[i])
      //   }
      // }

  });
