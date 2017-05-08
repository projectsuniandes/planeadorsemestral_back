angular.module('coursesCtrl', ['coursesService'])
.controller('coursesController', function($stateParams, Courses){
  var vm =this;
  vm.getCourses = function(){
    Courses.getCourses().success(function(data){
      vm.courses= data;
    })
  }
  vm.num=0;
  vm.getCourses();
  vm.generate = function(){
    Courses.optimize().success(function(data){
      
      vm.data = data;
      vm.semesters = vm.data.semesters;
      vm.num = vm.data.numSemesters;
      vm.totalCredits=0;
      console.log(vm.data);
      for (var i = 0;i< vm.data.semesters.length; i++) {
        vm.data.semesters[i]
        let semActual= vm.data.semesters[i];
        for (var j = 0; j < semActual.credits.length; j++) {
          vm.totalCredits+=semActual.credits[j];
        }
      }
      console.log(vm.totalCredits);
     
    })
  }
  vm.selectedCourses=[];
  vm.toggleSelection = function(selected){

    let i=vm.selectedCourses.indexOf(selected);


    if(vm.selected[selected]===1){
      vm.selectedCourses.push(selected);
    }
    else{
      vm.selectedCourses.splice(i,1);
    }
  }

})
