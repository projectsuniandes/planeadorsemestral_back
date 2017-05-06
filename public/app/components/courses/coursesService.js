angular.module('coursesService', [])
.factory('Courses',function($http){

	// create a new object
	var coursesFactory = {};
  let program1;
  let program2;
	let option;
	let maxCredits;
  coursesFactory.setPrograms = function(program_1, program_2, pOption, pMaxCredits){
    program1=program_1;
    program2=program_2;
		option=pOption;
		maxCredits=pMaxCredits;
  }
  coursesFactory.optimize= function(){
		console.log('in optimize');
		optimizeData= {};
		optimizeData.firstProgram= program1;
    optimizeData.secondProgram= program2;
		optimizeData.coursesTaken =[];
    optimizeData.option= option;
    optimizeData.minCredits=10;
    optimizeData.maxCredits=maxCredits;

    return $http.post('/api/optimize/', optimizeData);
  }
  coursesFactory.getCourses = function(){
    return $http.get('/api/merge?program1='+program1+'&program2='+program2);

  }


    return coursesFactory;
})
