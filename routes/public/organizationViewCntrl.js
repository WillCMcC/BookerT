app.controller('orgCtrl', orgs)

function orgs($scope, $http, $window, $document){
  $scope.title = "Organizations"
  $http.get('/api/organizations')
    .success(function(data, status, headers, config) {
      $scope.organizations = data;
      console.log(data)
    })
  console.log('working')
}
