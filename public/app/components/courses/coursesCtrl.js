angular.module('coursesCtrl', ['coursesService'])
.controller('coursesController', function($stateParams, Courses){
  var vm =this;
  vm.getCourses = function(){
    Courses.getCourses().success(function(data){
      vm.courses= data;
    })
  }
  vm.getCourses();
  vm.generate = function(){
    Courses.optimize().success(function(data){
      vm.results = data;
    })
  }
  console.log(vm.results);

})
