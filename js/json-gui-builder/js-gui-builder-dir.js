var builderModule = angular.module('json-gui-builder', ['ngRoute']);

builderModule.config(['$routeProvider',function($routeProvider) {
	$routeProvider
	.when('/portalModels/parameter', {
		templateUrl: 'js/json-gui-builder/parameterLink.html',
		controller: 'paramController'
	})
	.when('/portalModels/expressions', {
		templateUrl: 'js/json-gui-builder/expressionLink.html',
		controller: 'expreController'
	})
	.when('/portalModels/:back', {
		templateUrl: 'js/json-gui-builder/parameterListLink.html',
		controller: 'paramListControler'
	})
	.otherwise({
		redirectTo: '/portalModels/false'
	});
}]);

builderModule.service('dataTransfert', function(){

	//the entier data extract from the json file
	var data = {};

	//the temporary dependencies array (displayName + dbName) of the current parameter 
	var dependencies = [];

	//the index of the current parameter
	var currentParamIndex;

	var setData = function(obj) {
		data = obj;
	}

	var getData = function() {
		return data;
	}

	var setCurrentParamIndex = function(index) {
		currentParamIndex = index;
	}

	var getCurrentParamObject = function() {
		return data.parameters[currentParamIndex];
	}

	var getCurrentParamName = function() {
		return {name: data.parameters[currentParamIndex].displayName, varName: data.parameters[currentParamIndex].dbName};
	};

	var updateCurrentParam = function(obj) {
		data.parameters[currentParamIndex] = obj;
	}

	var setDependencies = function(obj) {
		dependencies = obj;
	};

	var getDependencies = function() {
		return dependencies;
	};

	var setExpressions = function(obj) {
		data.parameters[currentParamIndex].expressionsArr = obj;
	};

	var getExpressions = function() {
		return data.parameters[currentParamIndex].expressionsArr;
	};

	var getCategories = function() {
		return data.parametersCategories;
	}

	return {
		setData: setData,
		getData: getData,
		setCurrentParamIndex: setCurrentParamIndex,
		getCurrentParamObject: getCurrentParamObject,
		getCurrentParamName: getCurrentParamName,
		updateCurrentParam: updateCurrentParam,
		setDependencies: setDependencies,
		getDependencies: getDependencies,
		setExpressions: setExpressions,
		getExpressions: getExpressions,
		getCategories: getCategories
	};
});