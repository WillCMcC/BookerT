app.controller('orgCtrl', orgs)

function orgs($scope, $http, $window, $document, $location){
  var url = $location.absUrl().split('=')
  $scope.title = "Organizations"
  $http.get('/auth/acct')
    .success(function(data, status, headers, config) {
      $scope.user = data;
      console.log(data)
    })
  console.log(url.length);
  $http.get('/api/organizations')
    .success(function(data, status, headers, config) {
      $scope.organizations = data;
      console.log(data)
    })
if(url.length > 1){
  var theUuid = url[url.length -1]
  console.log(theUuid)
  $http.get('/api/organizations?uuid=' + theUuid)
    .success(function(data, status, headers, config) {
      $scope.org = data;
      console.log(data)
    })
}
}
