angular.module('optimizerCtrl', ['optimizerService'])
.controller('optimizerController', function($stateParams, Optimizer, Courses){
  var vm =this;
  vm.program1;
  vm.program2;
  vm.opcion;
  vm.getPrograms = function(){
    Optimizer.getPrograms().success(function(data){      
      vm.programs= data;
    })
  }
  vm.getPrograms();
  vm.setPrograms = function(program1,program2, opcion, maxCredits, minCredits){
    Courses.setPrograms(program1, program2, opcion, maxCredits, minCredits);
  }

})
