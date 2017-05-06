angular.module('graphCtrl', ['graphService', 'coursesService'])
.controller('graphController', function($stateParams, Graph, Courses){
  var vm = this;

  var getData = function(){
    Courses.optimize().success(function(data){
      console.log('getData graph');
      console.log(data);
      vm.data = data;
      vm.numSemesters= vm.data.num;
      console.log(vm.numSemesters);
      vm.semesters= [];
      vm.semesters.courses = [];
      for (var i = 1; i < vm.numSemesters; i++) {
        vm.semesters[i-1]=vm.data["semester"+i];
      }
      for (var i = 0; i < vm.semesters.length; i++) {
        let act = vm.semesters[i];
        for (var j = 0; j < act.courses.length; j++) {
          vm.semesters[i].courses[j]=act.courses[j];
        }
      }

    })
  }


})
