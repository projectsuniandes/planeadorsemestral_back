angular.module('graphCtrl', ['graphService'])
.controller('graphController', function($stateParams, Graph){
  var vm = this;

  var getData = function(){
    console.log('getData');
    vm.data = Graph.getData();
    vm.numSemesters = vm.data.num;
  }
  getData();
  console.log(vm.data);
  var setData= function(){
  vm.response = {};
  vm.response.semester = [];
  for (var i = 1; i <= vm.numSemesters; i++) {
      vm.response.semester[i]= vm.data["semester"+i];
    }
  }
  setData();
  console.log(vm.response);


})
