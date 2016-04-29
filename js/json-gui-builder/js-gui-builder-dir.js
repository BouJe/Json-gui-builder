var builderModule = angular.module('json-gui-builder', ['ngRoute']);

builderModule.config(['$routeProvider',function($routeProvider) {
	$routeProvider
	.when('/portalModels', {
		templateUrl: 'js/json-gui-builder/parameterTemplate.html',
		controller: 'paramController'
	})
	.when('/portalModels/expressions', {
		templateUrl: 'js/json-gui-builder/expressionTemplate.html',
		controller: 'expreController'
	})
	.when('/portalModels/:backFromExpre', {
		templateUrl: 'js/json-gui-builder/parameterTemplate.html',
		controller: 'paramController'
	})
	.otherwise({
		redirectTo: '/portalModels'
	});
}]);

builderModule.service('dataTransfert', function(){

	var paramObject = {};

	var dependencies = [];

	var setParamObject = function(Obj) {
		paramObject = Obj;
	}

	var getParamObject = function() {
		return paramObject;
	}

	var setDependencies = function(Obj) {
		dependencies = Obj;
	};

	var getDependencies = function() {
		return dependencies;
	};

	var getCurrentParam = function() {
		return {name: paramObject.displayName, varName: paramObject.dbName};
	};

	var setExpressions = function(Obj) {
		paramObject.expressionsArr = Obj;
	};

	var getExpressions = function() {
		return paramObject.expressionsArr;
	};

	return {
		setParamObject: setParamObject,
		getParamObject: getParamObject,
		setDependencies: setDependencies,
		getDependencies: getDependencies,
		getCurrentParam: getCurrentParam,
		setExpressions: setExpressions,
		getExpressions: getExpressions
	};
});