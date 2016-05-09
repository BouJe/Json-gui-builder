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

app.controller('paramListControler', ['$scope', '$routeParams', 'dataTransfert', function($scope, $routeParams, dataTransfert){

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

  //update the paramList with the parameter updated
  /*$scope.updateParameters = function() {
    
      var tmp = dataTransfert.getParamObject();
      var find = false;
      for (var i = 0; i < $scope.data.parameters.length; i++) {
        if ($scope.data.parameters[i].dbName == tmp.dbName) {
          $scope.data.parameters[i] = tmp;
          find = true;
        }
      }
      if (find == false) {
        $scope.data.parameters.push(tmp);
      }
            console.log($scope);
  }

  }*/

}]);

app.controller('paramController', function($scope, dataTransfert){

	$scope.parametersCategories = dataTransfert.getCategories();

  $scope.paramObject = dataTransfert.getCurrentParamObject();

  $scope.dependencies = dataTransfert.getDependencies();
});

app.controller('expreController', function($scope, dataTransfert){
  
  $scope.currentParam = dataTransfert.getCurrentParamName();

  $scope.dependencies = dataTransfert.getDependencies();

  $scope.epressions = dataTransfert.getExpressions();
  
});