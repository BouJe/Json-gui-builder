builderModule.directive('expressionDir', function(){

	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {
			curreParam: '=',
			dependenciesArr: '=',
			selectedExpre: '=',
			errorArr: '='
		}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E',
		templateUrl: 'js/json-gui-builder/expression/expression.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope, element, attrs, controllers) {

			//Initialisations///////////////////////////////////////////////////////////////////////

			//Initialise operators
			scope.operators = ['>', '<', '>=', '<=', '=', '!='];

			//Initialise array for selectable values
			scope.selectValArr = [scope.curreParam];//add the current Parrameter in the first place
			for (i =  0; i < scope.dependenciesArr.length; i++) {
				scope.selectValArr.push(scope.dependenciesArr[i]);
			}

			//Look for the index of the corresponding object in the selectable values array
			scope.getDependIndex = function(varName) {
				for (var i = 0; i < scope.selectValArr.length; i++) {
					if (scope.selectValArr[i].varName == varName) {
						return i;
					}
				}
				return "value";
			}

			//Initialise all the selected value if there is a selected expression
			if (scope.selectedExpre.operator == '') {
				scope.selectedExpre.operator = scope.operators[0];
				scope.btnDisplay = 'Choose value 2';
			} else {
				scope.val1Selected = scope.selectValArr[scope.getDependIndex(scope.selectedExpre.val1)];
				scope.tmpVal2 = scope.getDependIndex(scope.selectedExpre.val2);
				if (scope.tmpVal2 == 'value') {
					scope.btnDisplay = 'Enter a value';
					scope.val2Wr = scope.selectedExpre.val2;
					scope.val2 = '';
				} else {
					scope.btnDisplay = 'Dependencie';
					scope.val2 = scope.selectValArr[scope.tmpVal2];
				}
			}

			//Save functions/////////////////////////////////////////////////////////////

			scope.changeVal1 = function() {
				scope.selectedExpre.val1 = scope.val1Selected.varName;
			}

			scope.changeVal2 = function() {
				//if val2 is empty i have to take the value enter by the user
				if (scope.val2=='') {
					scope.selectedExpre.val2 = scope.val2Wr;
				} else {
					scope.selectedExpre.val2 = scope.val2.varName;
				}
			}

			////////////////////////////////////////////////////////////////////////////

			scope.btnManager = function(string, object) {
				scope.btnDisplay = string;
				scope.val2 = object;
				if (scope.val2 != '') {
					scope.val2Wr = '';
				}
				scope.changeVal2();
			}

		},
	};
});