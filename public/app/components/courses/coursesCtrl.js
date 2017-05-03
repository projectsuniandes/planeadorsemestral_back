angular.module('coursesCtrl', ['coursesService', 'graphService'])
.controller('coursesController', function($stateParams, Courses, Graph){
  var vm =this;
  vm.getCourses = function(){
    Courses.getCourses().success(function(data){
      vm.courses= data;
    })
  }
  vm.getCourses();
  vm.generate = function(){
    Courses.optimize().success(function(data){
      console.log(data);
      vm.data = data;
      vm.numSemesters = vm.data.num;

      vm.semesters= [];
      for (var i = 1; i < vm.numSemesters+1; i++) {
        vm.semesters[i-1]=vm.data["semester"+i];

      }
      for (var i = 0; i < vm.semesters.length; i++) {

        vm.semesters[i].courses = [];

        let act = vm.semesters[i];
        for (var j = 0; j < act.length; j++) {

          let ite= 1+i;
          let courseAct= vm.data["semester"+ite][j];

          vm.semesters[i].courses[j]=courseAct;
        }
      }
      console.log(vm);
    })
  }

})
