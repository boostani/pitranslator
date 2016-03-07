var app = angular.module('translator',[]);

app.controller('main', function($scope){
    
    var checkExpression = function(value){
        // check if valid expression
        var lambda = value;

         if (lambda.indexOf('(')>-1){
            console.log('contains');
         
                 
         }
        //$scope.lambdaval = val.match(\(([^\)]+)\));
    }
    

    $scope.$watch('formula', function(val) {
        
        checkExpression(val);
        
    });

});
