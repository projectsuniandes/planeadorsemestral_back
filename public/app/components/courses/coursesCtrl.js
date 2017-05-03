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
      vm.results = data;
      Graph.setData(data);
    })
  }
  console.log(vm.results);

})
