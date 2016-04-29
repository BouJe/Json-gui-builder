builderModule.directive('expressionListDir', ['$location', 'dataTransfert', function($location, dataTransfert){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {
			curreParam: '=',
			dependenciesArr: '=',
			expressions: '='
		}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'js/json-gui-builder/expressionList/expressionList.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope, iElm, iAttrs, controller) {
			scope.addExpression = function() {
				scope.expressions.push({
						val1: '',
						operator: '',
						val2: '',
						errorMsg: ''
				});
			}

			scope.deleteExpression = function(index) {
				scope.expressions.splice(index, 1);
			}

			scope.errorArr = [];

			scope.verifEmptyField = function(expression) {
				scope.tmp = {
					verifEmptyVal1: '0',
					verifEmptyVal2: '0',
					emptyMsg: '0'
				}
				if (expression.val1 == '') {
					scope.tmp.verifEmptyVal1 = '1';
				}
				if (expression.val2 == '' || expression.val2 == undefined) {
					scope.tmp.verifEmptyVal2 = '1';
				} 
				if (expression.errorMsg == '') {
					scope.tmp.emptyMsg = '1';
				}
				return scope.tmp;
			}

			//Return true if the error array contains no errors
			scope.checkErrorArr = function() {
				var countWrong = 0;
				for (var i = 0; i < scope.errorArr.length; i++) {
					if (scope.errorArr[i].verifEmptyVal1 == '1' || scope.errorArr[i].verifEmptyVal2 == '1' || scope.errorArr[i].emptyMsg == '1') {
						return false;
					}
				}
				return true;
			}

			scope.saveExpressions = function() {
				for (var i = 0; i < scope.expressions.length; i++) {
					scope.errorArr[i] = scope.verifEmptyField(scope.expressions[i]);
				}
				if (scope.checkErrorArr()) {
					dataTransfert.setExpressions(scope.expressions);
					$location.path('/portalModels/true');
				}
			}

		}
	};
}]);