angular.module('coursesCtrl', ['coursesService'])
.controller('coursesController', function($stateParams, Courses){
  var vm =this;
  vm.getCourses = function(){
    courses.getCourses().success(function(data){
      console.log(data);
      vm.courses= data;
    })
  }
  vm.getCourses();
})
