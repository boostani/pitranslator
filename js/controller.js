var app = angular.module('translator',[]);

app.controller('main', function($scope){
    
    String.prototype.replaceAt=function(index, character) {
        return this.substr(0, index) + character + this.substr(index+character.length);
    }
    
    //$scope.formula = 'abc';
    $scope.expression = [];
    $scope.error;
    $scope.output;
    var channelNum = 0;
    var lambda;
    
    $scope.setLambda = function(){
        $scope.output = '';
        var lambda = '';
        channelNum = 0;
        $scope.expression = [];
        var lambdaVal = document.getElementById('lambdaInput');
        $scope.parseExpression(lambdaVal.value, $scope.expression);
    };
    
    $scope.parseExpression = function(val, obj){
        
        // check if valid expression
        
        lambda = val;
        

        if(lambda.length>0){
             if(lambda.substr(0, 1) == '('){
                   obj.push([]);
                   var temp = lambda.substr(1, lambda.indexOf(')'));
                     
                   if(temp.indexOf('(')> -1){
                       
                       var closing = 0;
                       var tempLambda = lambda;
                       for(var i=1; i<tempLambda.length; i++){
                           
                  
                           if(tempLambda[i] == ')' && tempLambda.indexOf('(') < i && tempLambda.indexOf('(') != -1){
                             tempLambda = tempLambda.replaceAt(i ,'*');
                             tempLambda = tempLambda.replaceAt(tempLambda.indexOf('('), '*');
                               console.log(tempLambda);
                           }
                           if(lambda[i] == ')' && (tempLambda.indexOf('(') > i || tempLambda.indexOf('(') == -1)){
                             closing = i;
                               console.log(i);
                             break;
                           }
                           
                       }
                       
               
                           console.log(closing);
                           obj[obj.length-1].push(lambda.substr(1, closing-1));
                           return $scope.parseExpression(lambda.substr(closing+1, lambda.length-1), obj);
                       

                   }else{
                     //$scope.checkExpression(lambda.substr(1, lambda.indexOf(')')-1), obj[obj.length-1]);  
                    obj[obj.length-1].push(lambda.substr(1, lambda.indexOf(')')-1));
                     return $scope.parseExpression(lambda.substr(lambda.indexOf(')')+1, lambda.length-1), obj);
                   }

    
 
             } else if(lambda.substr(0, 1) == 'L'){
                 
                     var indexofdot =lambda.indexOf('.');
                 
                     obj.push(lambda.substr(0, indexofdot));
                     lambda = '('+lambda.substr(indexofdot+1, lambda.length-1)+')';
                     return $scope.parseExpression(lambda, obj);

  
            } else {
                 
                var counter = 1;
                for(i = 1; i<lambda.length; i++){
                   if(lambda[i] == '(' ||  lambda[i] == 'L'){
                        break; 
                   }else{
                      counter++;
                   }
                }
                
                if(counter>2){

                    lambda = '('+lambda
                    lambda = lambda.substr(0, counter)+')'+lambda.substr(counter);
                    return $scope.parseExpression(lambda, obj);

                }else{

                    obj.push(lambda.substr(0,  counter));
                    return $scope.parseExpression(lambda.substr(counter, lambda.length-1), obj);
                }
            }
                 /*obj.push(lambda.substr(0, 1));
                 return $scope.checkExpression(lambda.substr(1, lambda.length-1), obj);*/
     

             
             
        }else{
            
            for(var i = 0; i<obj.length; i++){
                
                if(Array.isArray(obj[i])){
                    
                    var arrContent = obj[i].toString();
                    obj[i] = [];
                    $scope.parseExpression(arrContent, obj[i]); 
                }
                
            }
            //return obj;
            
        }
        console.log($scope.expression);
        $scope.output = $scope.translateToPi($scope.expression);
        //$scope.lambdaval = val.match(\(([^\)]+)\));
    }
    

    $scope.translateToPi = function(expressionObj, chnl){
        channelNum++;
       var channel;
       if(!chnl){
          channel = 'c'+channelNum;

       }else{
          channel = chnl; 
       }
       
       if(typeof expressionObj[0] == 'string' && expressionObj[0].length == 1){
           return expressionObj[0]+'!'+channel;
       }
       if(typeof expressionObj[0] == 'string' && expressionObj[0].length == 2 && expressionObj[0].charAt(0) != 'L'){
           var expressionString = expressionObj[0].toString(); 
           var firstExpr = (expressionString).charAt(0);
           var secondExpr = (expressionString).charAt(1);
           console.log((expressionString).charAt(0));
           var channelA  = 'a'+ channelNum;
           var channelB  = 'b'+ channelNum;
           var channelC  = 'c'+ channelNum;

           
           // pattern to translate to new(a).new(b).(([M](a))|(a!b.a!p)|*((b?c).[N](c))

           
           return "new("+channelA+") . new("+channelB+") . ("+$scope.translateToPi(firstExpr, channelA)+" | "+channelA+"!"+channelB+" . "+channelA+"!"+channel+" | *("+channelB+"?"+channelC+" . "+ $scope.translateToPi(secondExpr, channelC)+")";
       }
        
       // chcke if it's lambda expression
       if(typeof expressionObj[0] == 'string' && expressionObj[0].length == 2 && expressionObj[0].charAt(0) == 'L'){
           
           var lambdaVar = expressionObj[0].charAt(1);
           var lambdaExpr = expressionObj[1]
           var channelQ = 'q'+ channelNum;
           // pattern to translate to: p?x.p?q.[M](q)
           
           return channel+'?'+lambdaVar+' . '+channel+'?'+channelQ+' . '+$scope.translateToPi(lambdaExpr, channelQ);
           
       }
        
       if(Array.isArray(expressionObj[0])){
           
           if(expressionObj[1] != 'undefined'){
               
               
           var firstExpr = expressionObj[0];
           var secondExpr = expressionObj[1];
           var channelA  = 'a'+ channelNum;
           var channelB  = 'b'+ channelNum;
           var channelC  = 'c'+ channelNum;

           
           // pattern to translate to new(a).new(b).(([M](a))|(a!b.a!p)|*((b?c).[N](c))

           
           return "new("+channelA+") . new("+channelB+") . ("+$scope.translateToPi(firstExpr, channelA)+" | "+channelA+"!"+channelB+" . "+channelA+"!"+channel+" | *("+channelB+"?"+channelC+" . "+ $scope.translateToPi(secondExpr, channelC)+")";
               
               
               
           } else {
               console.log(expressionObj[0][0]);
                return $scope.translateToPi(expressionObj[0][0], channelQ);
           }
       }
        
           
    }
       
        
        
       
    

});
