angular.module('graphCtrl', ['graphService', 'coursesService'])
.controller('graphController', function($stateParams, Graph, Courses){
  var vm = this;

  var getData = function(){
    Courses.optimize().success(function(data){
      

    })
  }


})
