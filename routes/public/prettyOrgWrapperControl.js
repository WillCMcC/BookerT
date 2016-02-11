
app.controller('orgWrapperCtrl', function ($scope, $http, $window, $document, $location) {

      var url = $location.absUrl().split('/')
      $scope.title = "Organizations"


      if(url.length > 1){
      var theUrl = url[url.length -1]
      $http.get('/api/organizations?orgUrl=' + theUrl)
        .success(function(data, status, headers, config) {
          $scope.org = data;
          console.log($scope.org.uuid)
        })
      }



  });
