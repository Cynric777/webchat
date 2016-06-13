//angular.module('webchatApp', [])
angular.module('webchatApp', ['ngRoute', 'angularMoment']).run(function($window, $rootScope, $http, $location) {
  $window.moment.locale('zh-cn')
  // $http({
  //   url: '/api/validate',
  //   method: 'GET'
  // }).then(function successCallback(user) {
  //   console.log("已登录")
  //   $rootScope.me = user
  //   $location.path('/')
  // }, function errorCallback(data) {
  //   console.log("未登录")
  //   $location.path('/login')
  // })
  $location.path('/login')
  $rootScope.logout = function() {
    $http({
      url: '/api/logout',
      method: 'GET'
    }).then(function successCallback(user) {
      // var _userId = user.data._id
      console.log("注销")
      $rootScope.me = null
      $location.path('/login')
      // $rootScope.$$childHead.room.users = $rootScope.$$childHead.room.users.filter(function(user) {
      //   return user._id != _userId
      // })
    })
  }
  $rootScope.$on('login', function(evt, me) {
    $rootScope.me = me
  })
})
