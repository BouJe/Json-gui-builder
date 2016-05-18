builderModule.directive('parameterListDir', ['$location', 'dataTransfert', function($location, dataTransfert){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
			scope: {
				data: '='
			}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
			templateUrl: 'js/json-gui-builder/parameterList/parameterList.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope, iElm, iAttrs, controller) {


			//PARAMETERS MANAGEMENT//////////////////////////////////////////////////////////////////////////////////////////////////

			scope.delParam = function(index) {
				scope.data.parameters.splice(index, 1);
			}

			scope.addParam = function() {
				scope.newParam = true;
			}

			scope.checkName = function(name) {
				scope.noName = false;
				scope.wrongName = false;
				//check if the user write something
				if (name == undefined || name == "") {
					scope.noName = true;
					return false;
				}
				//check if the name enter is not already used
				for (var i = 0; i < scope.data.parameters.length; i++) {
					if (scope.data.parameters[i].displayName == name) {	
						scope.wrongName = true;
						return false;
					}
				}
				return true;
			}

			//BUILDING DATA FUNCTIONS/////////////////////////////////////////////////////////////////////////

			//Build and send the dependencies array
			scope.buildDependenciesArrray = function(index) {
				scope.dependencies = [];
  				for (var i = 0; i < scope.data.parameters.length; i++) {
  					//exclude the current parameter
  					if (i != index) {
  						scope.dependencies.push({name: scope.data.parameters[i].displayName, varName: scope.data.parameters[i].dbName});
  					}
  				}
  				dataTransfert.setDependencies(scope.dependencies);
			}

			scope.buildDbName = function(name) {
				return name.toLowerCase().split(' ').join('_')+""+Date.now();
			}

			//EVENT FUNCTIONS///////////////////////////////////////////////////////////////////////////////////

			scope.goToSetting = function(index) {
				scope.buildDependenciesArrray(index);
				dataTransfert.setData(scope.data);
				dataTransfert.setCurrentParam(index);
				$location.path('/portalModels/parameter');
			}

			scope.validNewParam = function(name) {
				if (scope.checkName(name)) {
					scope.data.parameters.push({
						displayName: name,
						dbName: scope.buildDbName(name),
						dependenciesNames: [],
						computedResult:"(function(){return true;}())",
        				isValid: "return function v(parameters, dependencies){var retObject = {};retObject.valid= true;retObject.message=''; return retObject;}"
					});
					scope.newParam = false;
				}
			}
		}
	};
}]);