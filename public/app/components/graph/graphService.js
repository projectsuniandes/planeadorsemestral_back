angular.module('graphService', [])
.factory('Graph', function($http){
  var graphFactory = {};
  let data;
  graphFactory.setData = function(pData){
    console.log(pData);
    data=pData;
  }

  graphFactory.getData = function(){
    console.log(data);
    return data;
  }

  return graphFactory;

})
