angular.module('app.routes', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider){
  $urlRouterProvider.otherwise("/home");
  $locationProvider.html5Mode(true);
  console.log('routes');
  $stateProvider
    .state('home', {
       url         : "/home",
       templateUrl : "app/views/pages/optimizer.tpl.html",
       controller  : "mainController as main"
     })
     .state('courses', {
       url         : "/courses",
       templateUrl : "app/views/pages/courses.tpl.html",
       controller  : "coursesController as courses"
     })
     .state('graph', {
       url         : "/graph",
       templateUrl : "app/views/pages/graph.tpl.html",
       controller  : "coursesController as graph"
     });
})
