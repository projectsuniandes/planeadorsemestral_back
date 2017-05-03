angular.module('graphCtrl', ['graphService'])
.controller('graphController', function($stateParams, Graph){
  var vm = this;

  var getData = function(){
    vm.data = Graph.getData();
  }
  getData();
  vm.numSemesters= vm.data.length;
  var setData= function(){
    vm.semesters= [];
    vm.semesters.courses = [];
    for (var i = 0; i < vm.data.length; i++) {
      semesters[i]=vm.data[i];
    }
    for (var i = 0; i < vm.semesters.length; i++) {
      let act = vm.semesters[i];
      for (var j = 0; j < act.courses.length; j++) {
        vm.semesters[i].courses[j]=act.courses[j];
      }
    }
  }
  setData();
  console.log(vm.semesters);


})
