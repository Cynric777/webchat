angular.module('webchatApp').config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true)
  $routeProvider.when('/', {
    templateUrl: '/pages/room.html',
    controller: 'RoomCtrl'
  }).when('/index', {
    templateUrl: '/pages/index.html',
    controller: 'IndexCtrl'
  }).otherwise({
    redirectTo: '/index'
  })
})
