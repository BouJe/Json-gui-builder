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

	//the index of the current parameter
	var currentParamIndex;

	//A copy of the current parameter
	var currentParamObject = {};

	//the full dependencies array (displayName + dbName) 
	var dependencies = [];

	//DATA'S METHODS//////////////////////////////////////////////////////////////////////////

	var setData = function(obj) {
		data = obj;
	}

	var getData = function() {
		return data;
	}

	var getCategories = function() {
		return data.parametersCategories;
	}

	//CURRENT PARAMETER'S METHODS//////////////////////////////////////////////////////////////

	var setCurrentParam = function(index) {
		currentParamIndex = index;
		angular.copy(data.parameters[index], currentParamObject);
	}

	var getCurrentParamObject = function() {
		return currentParamObject;
	}

	var getCurrentParamName = function() {
		return {name: currentParamObject.displayName, varName: currentParamObject.dbName};
	};

	var setExpressions = function(obj) {
		currentParamObject.expressionsArr = obj;
	};

	var getExpressions = function() {
		return currentParamObject.expressionsArr;
	};

	var updateDataWithCurrentParam = function(obj) {
		data.parameters[currentParamIndex] = obj;
		//clear the parameter updated
		currentParamObject = {};
	}

	//DEPENDENCIES' METHODS////////////////////////////////////////////////////////////////////

	var setDependencies = function(arr) {
		dependencies = arr;
	};

	var getDependencies = function() {
		return dependencies;
	};

	var getSelectedDepencies= function() {
		var selectedDepArr = [];
		for (var i = 0; i < currentParamObject.dependenciesNames.length; i++) {
			for (var j = 0; j < dependencies.length; j++) {
				if (dependencies[j].varName == currentParamObject.dependenciesNames[i]) {
					selectedDepArr.push(dependencies[j]);
				}
			}
		}
		return selectedDepArr;
	}

	return {
		setData: setData,
		getData: getData,
		getCategories: getCategories,
		setCurrentParam: setCurrentParam,
		getCurrentParamObject: getCurrentParamObject,
		getCurrentParamName: getCurrentParamName,
		setExpressions: setExpressions,
		getExpressions: getExpressions,
		updateDataWithCurrentParam: updateDataWithCurrentParam,
		setDependencies: setDependencies,
		getDependencies: getDependencies,
		getSelectedDepencies : getSelectedDepencies
	};
});