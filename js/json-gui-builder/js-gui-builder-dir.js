var builderModule = angular.module('json-gui-builder', ['ngRoute']);

builderModule.config(['$routeProvider',function($routeProvider) {
	$routeProvider
	.when('/portalModels', {
		templateUrl: 'js/json-gui-builder/parameterListLink.html',
		controller: 'paramListControler'
	})
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
		redirectTo: '/portalModels'
	});
}]);

builderModule.service('dataTransfert', function(){

	var paramObject = {};

	var dependencies = [];

	var categories = [];

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

	var setCategories = function(Obj) {
		categories = Obj;
	}

	var getCategories = function() {
		return categories;
	}

	return {
		setParamObject: setParamObject,
		getParamObject: getParamObject,
		setDependencies: setDependencies,
		getDependencies: getDependencies,
		getCurrentParam: getCurrentParam,
		setExpressions: setExpressions,
		getExpressions: getExpressions,
		setCategories: setCategories,
		getCategories: getCategories
	};
});