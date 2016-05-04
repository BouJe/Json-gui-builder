builderModule.directive('parameterListDir', ['$location', 'dataTransfert', function($location, dataTransfert){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
			scope: {
				parameterList: '='
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
				
			scope.goToSetting = function(index) {
				dataTransfert.setParamObject(scope.parameterList[index]);
				$location.path('/portalModels/parameter');
			}

			scope.delParam = function(index) {
				scope.parameterList.splice(index, 1);
			}

			scope.addParam = function() {
				scope.newParam = true;
			}

			scope.checkName = function(name) {
				//check if the user write something
				if (name == undefined) {
					scope.noName = true;
					return false;
				}
				//check if the name enter is not already used
				for (var i = 0; i < scope.parameterList.length; i++) {
					if (scope.parameterList[i].displayName == name) {
						scope.wrongName = true;
						return false;
					}
				}
				return true;
			}
			scope.geneDbName = function(name) {
				return name.toLowerCase().split(' ').join('_')+""+Date.now();
			}

			scope.saveNewParam = function(name) {
				if (scope.checkName(name)) {
					scope.parameterList.push({
						displayName: name,
						dbName: scope.geneDbName(name),
						dependenciesNames: [],
						computedResult:"(function(){return true;}())",
        				isValid: "return function v(parameters, dependencies){var retObject = {};retObject.valid= true;retObject.message=''; return retObject;}",
						expressionsArr: []
					});
					scope.newParam = false;
				}
			}
		}
	};
}]);