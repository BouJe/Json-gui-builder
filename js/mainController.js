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

  $scope.data = $scope.parseParamFromJson("json/wrf-arw.json");
  
  $scope.paramList = [
      {
        parameterType:"float",
        value: 26,
        displayName:"B Day",
        namelistName: "b_day",
        dbName: "b_day",
        dependenciesNames:["b_year"],
        parameterCategory: 4,
        computedResult:"(function(){return true;}())",
        isValid: "return function v(parameters, dependencies){var retObject = {};retObject.valid= true;retObject.message=''; return retObject;}",
        expressionsArr: [
          {val1: 'b_day',
            operator: '<',
            val2: '31',
            errorMsg: 'Wrong date'}
        ]
       },
       {
        parameterType:"integer",
        value: 94,
        displayName: "B Year",
        namelistName: "b_year",
        dbName: "b_year",
        dependenciesNames:["b_day"],
        parameterCategory: 4,
        computedResult:"(function(){return true;}())",
        isValid: "return function v(parameters, dependencies){var retObject = {};retObject.valid= true;retObject.message=''; return retObject;}",
        expressionsArr: [
          {val1: 'b_year',
            operator: '>',
            val2: '1900',
            errorMsg: 'Too old'}
        ]
       },
       {
        parameterType:"float",
        value:54,
        displayName:"Grid Spacing",
        namelistName: "grid_spacing",
        dbName: "grid_spacing",
        dependenciesNames: ["parental_grid_ratio"],
        computedResult:"(function(){return true;}())",
        parameterCategory:3,
        isValid: "return function v(parameters, dependencies){var retObject = {};retObject.valid= true;retObject.message=''; return retObject;}",
        expressionsArr: [
          {val1: 'grid_spacing',
            operator: '<',
            val2: 'parental_grid_ratio',
            errorMsg: 'Wrong value'}
        ]
      }, 
      {
        parameterType:"integer",
        value:18,
        displayName:"Parental Grid Ratio",
        namelistName: "parental_grid_ratio",
        dbName: "parental_grid_ratio",
        parameterCategory:3,
        dependenciesNames:["grid_spacing"],
        computedResult:"(function(){return true;}())",
        isValid: "return function v(parameters, dependencies){var retObject = {};retObject.valid= true;retObject.message=''; return retObject;}",
        expressionsArr: []
      },
  ];

  //update the paramList with the parameter updated
  if ($routeParams.back == "true") {
    var tmp = dataTransfert.getParamObject();
    var find = false;
    for (var i = 0; i < $scope.paramList.length; i++) {
      if ($scope.paramList[i].dbName == tmp.dbName) {
        $scope.paramList[i] = tmp;
        find = true;
      }
    }
    if (find == false) {
      $scope.paramList.push(tmp);
    }
  }

  //Build dependencies array
  $scope.dependencies = [];
  for (var i = 0; i < $scope.paramList.length; i++) {
    $scope.dependencies.push({name: $scope.paramList[i].displayName, varName: $scope.paramList[i].dbName});
  }
  dataTransfert.setDependencies($scope.dependencies);

  $scope.categories = [
      {name:'Domain', value:1},
      {name:"Time Control", value:2},
      {name:"Run Option", value:3},
      {name:"Physics Option", value:4},
      {name:"Diffusion and Dynamic Options", value:5},
      {name:"Submit", value:6}
  ];

  dataTransfert.setCategories($scope.categories);

}]);

app.controller('paramController', function($scope, dataTransfert){

	$scope.parametersCategories = dataTransfert.getCategories();

  $scope.paramObject = dataTransfert.getParamObject();

  $scope.dependencies = dataTransfert.getDependencies();
});

app.controller('expreController', function($scope, dataTransfert){
  
  $scope.currentParam = dataTransfert.getCurrentParam();

  $scope.dependencies = dataTransfert.getDependencies();

  $scope.epressions = dataTransfert.getExpressions();
  
});