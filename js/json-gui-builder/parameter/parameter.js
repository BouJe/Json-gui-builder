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

			//Initialisation
			if (scope.paramObject.parameterType != "") {
				scope.dataType = scope.paramObject.parameterType;
			}
			if (scope.paramObject.namelistName != "") {
				scope.namelistName = scope.paramObject.namelistName;
			}
			if (scope.paramObject.parameterCategory != "") {
				scope.category = scope.paramObject.parameterCategory;
			}

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
				}
				//I change the dataType property
				scope.paramObject.parameterType=scope.dataType;
				//And then i add the specific properties of the new dataType
				switch (scope.dataType)
				{
					case 'fileupload':
						scope.paramObject.maxSize = "3kb";
						scope.maxSize = {maxSizeUnit: "kb", maxSizeValue: '3'};

						//scope.maxSizeValue = "3";
						//scope.maxSizeUnit = "kb"
						scope.paramObject.maxUpload = 2;
						scope.maxUploadValue = 2;
						scope.paramObject.minUpload = 1;
						scope.minUploadValue = 1;
						break;
					case 'datetime':
						scope.paramObject.hasDate = true;
						scope.hasDate = "1";
						scope.paramObject.hasTime = true;
						scope.hasTime = "1";
						break;
					case 'domains':
						scope.paramObject.centerCoords = {"lat":44.496,"long":8.9209};
						scope.paramObject.mapZoom = 8;
						scope.paramObject.onlyNested = true;
						scope.onlyNested = "1";
						scope.paramObject.maxDomains = 4;
						scope.maxDomainsValue = 4;
						break;
					case 'select':
						scope.paramObject.values = [];
						break;
				}
				//console.log(scope.paramObject);
			}

			//fileupload specific field watcher
			scope.$watch('maxSize', function(){
				if (scope.maxSize != undefined) {
					scope.paramObject.maxSize = scope.maxSize.maxSizeValue.concat(scope.maxSize.maxSizeUnit);
				}
			}, true)

			scope.changeMaxUpload = function(){
				scope.paramObject.maxUpload = scope.maxUploadValue;
			}

			scope.ChangeMinUpload = function(){
				scope.paramObject.minUpload = scope.minUploadValue;
			}

			//datetime specific fields
			scope.changeDate = function(){
				scope.paramObject.hasDate = scope.hasDate;
			}

			scope.changeTime = function(){
				scope.paramObject.hasTime = scope.hasTime;
			}

			scope.dateOrTime = function() {
				if (scope.hasTime == false && scope.hasDate == false) {
					return true;
				} else {
					return false;
				}
			}

			//Domains specific field
			scope.changeOnlyNested = function(){
				scope.paramObject.onlyNested = scope.onlyNested;
			}

			scope.changeMaxDomains = function(){
				scope.paramObject.maxDomains = scope.maxDomainsValue;
			}

			//Select type function
			scope.addOption = function() {
				scope.paramObject.values.push({name: "", value: scope.paramObject.values.length });
			}

			scope.delOption = function(index) {
				scope.paramObject.values.splice(index, 1);
			}

			//DEPENDENCIES

			//Look for the display name in the dependencies array given to the directive
			scope.getDpName = function(varName) {
				for (var i = 0; i < scope.dependenciesArr.length; i++) {
					if (scope.dependenciesArr[i].varName == varName) {
						return scope.dependenciesArr[i].name;
					}
				}
			}

			//Initialisation of the selected dependencies array with already selected dependencies
			scope.selectedDependencies = [];
			for (var i = 0; i < scope.paramObject.dependenciesNames.length; i++) {
				scope.selectedDependencies.push({
					name: scope.getDpName(scope.paramObject.dependenciesNames[i]),
					varName: scope.paramObject.dependenciesNames[i]
				});
			}

			scope.addDependencie = function(string) {
				scope.checkDependencie(string);
				if (scope.dependencieError == 0) {
					scope.paramObject.dependenciesNames.push(scope.dependenciesArr[scope.depenInd].varName);
					scope.selectedDependencies.push(scope.dependenciesArr[scope.depenInd]);
				}
				scope.newDepen = "";
				console.log(scope.selectedDependencies);
			}

			scope.checkDependencie = function(string) {
				scope.isADependencie = 0;
				scope.alreadyAdd = 0;
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

			scope.delDependencie = function(index, string) {
				scope.selectedDependencies.splice(index, 1);
				for (i = 0; i < scope.paramObject.dependenciesNames.length; i++) {
					if (scope.paramObject.dependenciesNames[i] == string) {
						index = i;
					}
				}
				scope.paramObject.dependenciesNames.splice(index, 1);
				console.log(scope.paramObject.dependenciesNames);
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
				if (value < 1) {
					return true;
				} else {
					return false;
				}
			}

			//SAVE FONCTION
			scope.errorArr = {};//stock the errors variables

			scope.saveNameList = function() {
				if (scope.namelistName == "" || scope.namelistName == undefined) {
					scope.errorArr.nameList = 1;
				} else {
					scope.paramObject.namelistName = scope.namelistName;
					scope.errorArr.nameList = 0;
				}
			}

			//Save temporary without check
			scope.tmpSave = function() {
				scope.paramObject.namelistName = scope.namelistName;
				scope.paramObject.parameterCategory = scope.category;
			}

			scope.goToExpression = function() {
				scope.tmpSave();
				dataTransfert.setDependencies(scope.selectedDependencies);
    			dataTransfert.setParamObject(scope.paramObject);
    			$location.path('/portalModels/expressions');
  			}

  			/*scope.$watch('paramObject', function() {
  				console.log(scope.paramObject);
  			}, true)*/
		}

	};
}]);