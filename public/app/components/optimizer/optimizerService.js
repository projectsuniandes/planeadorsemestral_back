angular.module('optimizerService', [])
.factory('Optimizer',function($http){

	// create a new object
	var optimizerFactory = {};

  optimizerFactory.optimize= function(optimizeData){
    return $http.post('/api/optimize/', optimizeData);
  }
  optimizerFactory.getPrograms = function(){
    return $http.get('/api/programs');

  }
  


    return optimizerFactory;
})
