angular.module('graphService', [])
.factory('Graph', function($http){
  var graphFactory = {};
  let data;
  graphFactory.setData = function(pData){
    data=pData;
  }

  graphFactory.getData = function(){
    return data;
  }

  return graphFactory;

})
