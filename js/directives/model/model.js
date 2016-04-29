directives.directive('model', function($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'js/directives/model/model.html',
        replace: true,
        scope: {
            modelData:"=",
        },
        link:function(scope,elm,attr) {
            
            scope.pars = [];
            scope.dep=[];
            scope.buildParametersArray = function(){
                var jsonPars = scope.modelData.parameters;
                for(var par in jsonPars){
                    scope.pars[jsonPars[par].dbName] = jsonPars[par];
                }
                console.log(scope.pars);
            }
            $timeout(function(){
                $('#nav').affix({
                    offset: {
                    }
                });
                $('body').scrollspy({ target: '#scrollspy' })
            });

            scope.buildDependencies = function(){
                var currDeps;
                for(var par in scope.pars){ // par contiene il nome del parametro
                    var obj={};
                    currDeps = scope.pars[par].dependenciesNames;
                    for(var i=0;i<currDeps.length;i++) {
                        obj[currDeps[i]] = scope.pars[currDeps[i]];
                    }
                    scope.dep[par] = obj;
                }
                console.log(scope.dep)
            }


            scope.generateNamelist= function(){
                var namelist="";
                for(var par in scope.pars){
                    console.log(scope.pars[par]);

                    if(!scope.pars[par].evaluate()){
                        console.log("Errore in qualche parametro");
                        return;
                    }
                    namelist+= scope.pars[par].displayName+": "+ eval(scope.pars[par].computedResult)+";\n";
                }
                console.log(namelist);

            }


            scope.hashToArray = function(items) {
                var result = {};
                var i = 0;
                for(item in items){
                    result[i] = item;
                    i++;
                }
                return result;
            }
            scope.buildParametersArray();
            scope.buildDependencies();

        }

    };
});
