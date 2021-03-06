var app = angular.module('app', ['json-gui', 'json-gui-builder', 'ngFileUpload']).config(function(){
});
app.run(function(){

})

app.controller('modelController', function($scope, $timeout) {
    $scope.parseModelFromJson = function(url) {

        $.getJSON(url, function(data) {         
            $scope.data = data;
            console.log($scope.data);//console.log(scope);
        });
    }
    $scope.data = $scope.parseModelFromJson("json/wrf-arw.json");
});

app.controller('paramListControler', ['$scope', '$routeParams', '$http','dataTransfert', function($scope, $routeParams, $http, dataTransfert){

  $scope.parseParamFromJson = function(url) {

    $.getJSON(url, function(data) {
      $scope.data = data;
    });
  }  
  
  if ($routeParams.back == "true") {
    $scope.data = dataTransfert.getData();
  } else {
    $scope.parseParamFromJson("json/wrf-arw.json");
  }

  $scope.saveOnJson = function() {
    //var jsonData = angular.toJson($scope.data, true);
    //console.log(jsonData);
    //$http.post("http://localhost/JSONreception/JSONreception.php", jsonData).error(function(status){console.log(status)});;
    $http({method: 'POST', url: 'http://localhost/JSONreception/JSONreception.php', data: $scope.data}).
        then(function(response) {
          console.log(response.status);
          console.log(response.data);
        }, function(response) {
          console.log(response.data);
          console.log(response.status);
      });
  }

}]);

app.controller('paramController', function($scope, dataTransfert){

	$scope.parametersCategories = dataTransfert.getCategories();

  $scope.paramObject = dataTransfert.getCurrentParamObject();

  $scope.dependencies = dataTransfert.getDependencies();
});

app.controller('expreController', function($scope, dataTransfert){
  
  $scope.currentParam = dataTransfert.getCurrentParamName();

  $scope.dependencies = dataTransfert.getSelectedDepencies();

  $scope.epressions = dataTransfert.getExpressions();
  
});