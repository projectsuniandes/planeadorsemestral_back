angular.module('optimizerCtrl', ['optimizerService'])
.controller('optimizerController', function($stateParams, Optimizer){
  var vm =this;
  vm.getPrograms = function(){
    Optimizer.getPrograms().success(function(data){
      console.log(data);
      vm.programs= data;
    })
  }
  vm.getPrograms();
})
