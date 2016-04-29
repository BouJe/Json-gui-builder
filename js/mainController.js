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

app.controller('paramController', function($scope, $routeParams, $rootScope, dataTransfert){

  $scope.dependencies = [
    {name:'Dependencie 1', varName:'dep1'},
    {name:'Dependencie 2', varName:'dep2'},
    {name:'Dependencie 3', varName:'dep3'},
    {name:'Dependencie 4', varName:'dep4'}
  ];

	$scope.parametersCategories = [
      {name:'Domain', value:1},
      {name:"Time Control", value:2},
      {name:"Run Option", value:3},
      {name:"Physics Option", value:4},
      {name:"Diffusion and Dynamic Options", value:5},
      {name:"Submit", value:6}
  ];

	$scope.paramObject = {
		    parameterType:"",
        value:"",
        displayName:"Choosen Before",
        namelistName: "",
        dbName: "staticdbname",
        dependenciesNames:["dep1"],
        parameterCategory:"",
        computedResult:"(function(){return true;}())",
        isValid: "return function v(parameters, dependencies){var retObject = {};retObject.valid= true;retObject.message=''; return retObject;}",
        expressionsArr: [
          {val1: 'staticdbname',
            operator: '>',
            val2: '1234',
            errorMsg: 'Coucou'}
        ]
	}

  if ($routeParams.backFromExpre == "true") {
    $scope.paramObject = dataTransfert.getParamObject();
  }

});

app.controller('expreController', function($scope, dataTransfert){
  
  $scope.currentParam = dataTransfert.getCurrentParam();

  $scope.dependencies = dataTransfert.getDependencies();

  $scope.epressions = dataTransfert.getExpressions();
  
});