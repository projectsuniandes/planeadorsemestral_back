angular.module('coursesService', [])
.factory('Courses',function($http){

	// create a new object
	var coursesFactory = {};

  coursesFactory.optimize= function(optimizeData){
    return $http.post('/api/optimize/', optimizeData);
  }
  coursesFactory.getCourses = function(){
    return $http.get('/api/courses');

  }


    return coursesFactory;
})
