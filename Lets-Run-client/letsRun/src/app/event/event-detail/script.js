var MyApp = angular.module('MyApp', ['ui.scroll']);

    MyApp.controller('MyAppCtrl', function($scope,$http,$timeout) {
      var myOff = 0;
     var doRequest = function(offset){
       var url = "http://api.reddit.com/hot?after=&jsonp=JSON_CALLBACK";
        console.log(url);
        $http.jsonp(url).success(function(data){
                console.log(data.data.children);
                $scope.request = data.data.children;
        });
     };
        doRequest(0);
        $scope.myData = {
          get : function(index, count, success) {
            
            return $timeout(function() {
                console.log(index, count, $scope.request);
                  success($scope.request.slice(index-1, index-1 + count));
                  myOff+=count;
            },800);
          }
        };
    
      
      
    });