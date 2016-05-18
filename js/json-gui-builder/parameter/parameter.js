builderModule.directive('parameterDir', ['$location', 'dataTransfert', function($location, dataTransfert){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {
			paramObject: '=',
			dependenciesArr: '=',
			categoryArr: '='
		}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		//template: '<p>Hello</p>',
		templateUrl: 'js/json-gui-builder/parameter/parameter.html',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope, iElm, iAttrs, controller) {

			//INITIALISATION//////////////////////////////////////////////////////////////////////////////////////

			//Main fields initialisation
			if (scope.paramObject.parameterType != "") {
				scope.dataType = scope.paramObject.parameterType;
			}
			if (scope.paramObject.parameterCategory != undefined) {
				scope.paramObject.parameterCategory = scope.paramObject.parameterCategory.toString();
			}
			if (scope.paramObject.expressionsArr == undefined) {
				scope.paramObject.expressionsArr = [];
			}

			//Specific fields initialisation
			switch (scope.paramObject.parameterType)
			{
				case 'fileupload':
					var unit = scope.paramObject.maxSize.slice(-2, scope.paramObject.maxSize.length);
					var value = scope.paramObject.maxSize.slice(0, scope.paramObject.maxSize.length-2)
					scope.maxSize = {maxSizeUnit: unit, maxSizeValue: value};
					break;
				case 'datetime':
					scope.hasDate = scope.paramObject.hasDate.toString();
					scope.hasTime = scope.paramObject.hasTime.toString();
					console.log(scope.hasDate);
					console.log(scope.paramObject.hasDate);
					break;
				case 'domains':
					scope.onlyNested = scope.paramObject.onlyNested.toString();
					break;
				default:
					break;
			}

			//Reset isValid property for the default value (Rebuild with save function)
			scope.paramObject.isValid = "return function v(parameters, dependencies){var retObject = {};retObject.valid= true;retObject.message='';return retObject;}";

			//REAL TIME UPDATE FUNCTIONS////////////////////////////////////////////////////////////////////////////

			scope.changeType = function() {
				scope.paramObject.value = "";
				//before changing the dataType I delete the property not used anymore
				switch (scope.paramObject.parameterType)
				{
					case 'fileupload':
						delete scope.paramObject.maxSize;
						delete scope.paramObject.maxUpload;
						delete scope.paramObject.minUpload;
						break;
					case 'datetime':
						delete scope.paramObject.hasDate;
						delete scope.paramObject.hasTime;
						break;
					case 'domains':
						delete scope.paramObject.centerCoords;
						delete scope.paramObject.mapZoom;
						delete scope.paramObject.onlyNested;
						delete  scope.paramObject.maxDomains;
						break;
					case 'select':
						delete scope.paramObject.values;
						break;
					default:
						break;
				}
				//I change the dataType property
				scope.paramObject.parameterType=scope.dataType;
				//And then i add the specific properties of the new dataType
				switch (scope.dataType)
				{
					case 'fileupload':
						scope.paramObject.maxSize = "3kb";
						scope.maxSize = {maxSizeUnit: "kb", maxSizeValue: '3'};
						scope.paramObject.maxUpload = 2;
						scope.paramObject.minUpload = 1;
						break;
					case 'datetime':
						scope.paramObject.hasDate = true;
						scope.hasDate = "true";
						scope.paramObject.hasTime = true;
						scope.hasTime = "true";
						break;
					case 'domains':
						scope.paramObject.centerCoords = {"lat":44.496,"long":8.9209};
						scope.paramObject.mapZoom = 8;
						scope.paramObject.onlyNested = true;
						scope.onlyNested = "true";
						scope.paramObject.maxDomains = 4;
						break;
					case 'select':
						scope.paramObject.values = [];
						break;
					default:
						break;
				}
			}

			//fileupload specific field watcher
			scope.$watch('maxSize', function(){
				if (scope.maxSize != undefined) {
					scope.paramObject.maxSize = scope.maxSize.maxSizeValue.concat(scope.maxSize.maxSizeUnit);
				}
			}, true)

			//datetime specific fields
			scope.changeDate = function(value){
				if (value == "true") {
					scope.paramObject.hasDate = true;
				} else {
					scope.paramObject.hasDate = false;
				}
			}

			scope.changeTime = function(value){
				if (value == "true") {
					scope.paramObject.hasTime = true;
				} else {
					scope.paramObject.hasTime = false;
				}
			}

			//Domains specific field
			scope.changeOnlyNested = function(value){
				if (value == "true") {
					scope.paramObject.onlyNested = true;
				} else {
					scope.paramObject.onlyNested = false;
				}
			}

			//Select type function
			scope.addOption = function() {
				scope.paramObject.values.push({name: "", value: scope.paramObject.values.length });
			}

			scope.delOption = function(index) {
				scope.paramObject.values.splice(index, 1);
			}

			//DEPENDENCIES//////////////////////////////////////////////////////////////////////////////////////

			//Look for the display name in the dependencies array given to the directive
			scope.getDpName = function(varName) {
				for (var i = 0; i < scope.dependenciesArr.length; i++) {
					if (scope.dependenciesArr[i].varName == varName) {
						return scope.dependenciesArr[i].name;
					}
				}
			}

			//Initialisation of the selected dependencies array with already selected dependencies
			scope.selectedDependencies = [];//array of {name: "string", varName: "string"}
			for (var i = 0; i < scope.paramObject.dependenciesNames.length; i++) {
				scope.selectedDependencies.push({
					name: scope.getDpName(scope.paramObject.dependenciesNames[i]),
					varName: scope.paramObject.dependenciesNames[i]
				});
			}

			scope.addDependencie = function(string) {
				scope.checkDependencie(string);
				if (scope.dependencieError == 0) {
					scope.selectedDependencies.push(scope.dependenciesArr[scope.depenInd]);
					scope.paramObject.dependenciesNames.push(scope.dependenciesArr[scope.depenInd].varName)
				}
				scope.newDepen = "";
			}

			scope.delDependencie = function(index, string) {
				scope.selectedDependencies.splice(index, 1);
				for (i = 0; i < scope.paramObject.dependenciesNames.length; i++) {
					if (scope.paramObject.dependenciesNames[i] == string) {
						index = i;
					}
				}
				scope.paramObject.dependenciesNames.splice(index, 1);
			}

			//CHECK FUNCTIONS////////////////////////////////////////////////////////////////////////////////////

			scope.dateOrTime = function() {
				if (scope.paramObject.hasDate == false && scope.paramObject.hasTime == false) {
					return true;
				} else {
					return false;
				}
			}

			scope.containsBlanks = function(string) {
				if (typeof string == "undefined") {
					return false;
				}
				if (string.indexOf(" ") != -1) {
					return true;
				} else {
					return false;
				}
			}

			scope.isPositive = function(value) {
				if (typeof string == undefined) {
					return false;
				}
				if (value < 0) {
					return true;
				} else {
					return false;
				}
			}

			scope.isLessThan = function(val1, val2) {
				if (val1 == "" || val2 == "") return false;
				if (val1 < val2) {
					return true;
				} else {
					return false;
				}
			}

			scope.checkDependencie = function(string) {
				scope.isADependencie = 0;
				scope.alreadyAdd = 0;
				//firt check if the string is well a dependencie
				for (i = 0; i < scope.dependenciesArr.length; i++) {
					if (scope.dependenciesArr[i].name == string) {
						scope.isADependencie = 1;
						scope.depenInd = i;
					} 
				}
				if (scope.isADependencie != 1) {
					scope.dependencieError = 1;
					return;
				}
				//Second check if the dependencie is not already selected
				for (i = 0; i < scope.paramObject.dependenciesNames.length; i++) {
					if (scope.paramObject.dependenciesNames[i] == scope.dependenciesArr[scope.depenInd].varName) {
						scope.alreadyAdd = 1;
					}
				}
				if (scope.alreadyAdd == 0) {
					scope.dependencieError = 0;
				} else {
					scope.dependencieError = 1;
				}
			}

			scope.checkSetting = function() {
				var valid = true;//returned value, change to false is something wrong
  				scope.errorArr = {};//stock the errors variables
  				if (scope.dataType == "" || scope.dataType == undefined) {
  					scope.errorArr.dataType = true;
  					valid = false;
  				} else {
  					scope.errorArr.dataType = false;
  				}
  				if (scope.paramObject.namelistName == "" || scope.paramObject.namelistName == undefined) {
					scope.errorArr.nameList = true;
					valid = false;
				} else {
					if (scope.containsBlanks(scope.paramObject.namelistName)) valid = false;
					scope.errorArr.nameList = false;
				}
				if (scope.paramObject.parameterCategory == "" || scope.paramObject.parameterCategory == undefined) {
					scope.errorArr.category = true;
					valid = false;
				} else {
					scope.errorArr.category = false;
				}
				//check specific values
				switch (scope.paramObject.parameterType)
				{
					case 'fileupload':
						if (scope.isPositive(scope.maxSize.value)) valid = false;
						if (scope.isPositive(scope.paramObject.maxUpload)) valid = false;
						if (scope.isPositive(scope.paramObject.minUpload)) valid = false;
						if (scope.isLessThan(scope.paramObject.maxUpload, scope.paramObject.minUpload)) valid = false;
					break;
					case 'datetime':
						if (scope.dateOrTime()) valid = false;
					break;
					case 'domains':
						if (scope.isPositive(paramObject.maxDomains)) valid = false;
					break;
					default:
					break;
				}
				return valid;
  			}

			//SAVE FONCTION///////////////////////////////////////////////////////////////////////////////////

			scope.goToExpression = function() {
				dataTransfert.setDependencies(scope.selectedDependencies);
    			$location.path('/portalModels/expressions');
  			}

  			//Build the isValid property
  			scope.buildIsVaslid = function() {
  				if (scope.paramObject.expressionsArr.length != 0) {
  					var res = "return function v(parameters, dependencies){var retObject = {};";
 	 				for (var i = 0; i < scope.paramObject.expressionsArr.length; i++) {
  						if(i!=0) res += "else ";
  						res += "if(";
  						if (scope.paramObject.expressionsArr[i].val1 == scope.paramObject.dbName) {
  							res += "parameters.value";
  						} else {
 	 						res += "dependencies['"+scope.paramObject.expressionsArr[i].val1+"'].value";
  						}
  						res += ""+scope.paramObject.expressionsArr[i].operator+"";
  						var val2name = scope.getDpName(scope.paramObject.expressionsArr[i].val2);
  						if ( val2name == undefined) {
  							res += ""+scope.paramObject.expressionsArr[i].val2+")";
	  					} else {
  							res += "dependencies['"+scope.paramObject.expressionsArr[i].val2+"'].value)";
  						}
  						res += "{retObject.valid= false;retObject.message = "+scope.paramObject.expressionsArr[i].errorMsg+";}";
  					}
  					res += "else {retObject.valid= true;retObject.message='';}return retObject;}";
	  				scope.paramObject.isValid = res;
  				}
			}

			scope.saveParameter = function() {
				if (scope.checkSetting()) {
					scope.buildIsVaslid();
					dataTransfert.updateDataWithCurrentParam(scope.paramObject);
					$location.path('/portalModels/true');
				}
			}

			console.log(scope.paramObject);
		}
	};
}]);