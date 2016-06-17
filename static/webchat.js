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
  $location.path('/index')
  $rootScope.logout = function() {
    $http({
      url: '/api/logout',
      method: 'GET'
    }).then(function successCallback(user) {
      // var _userId = user.data._id
      console.log("注销")
      $rootScope.me = null
      $location.path('/index')
      // $rootScope.$$childHead.room.users = $rootScope.$$childHead.room.users.filter(function(user) {
      //   return user._id != _userId
      // })
    })
  }
  $rootScope.handle = function(apply) {
    console.log(apply)
  }
  $rootScope.handleAgree = function(apply) {
    console.log("agree")
    console.log(apply)
    var _applyId = apply._id
    $http({
      url: '/api/handleApply',
      method: 'POST',
      data: {
        _applyId: _applyId,
        result: true
      }
    }).then(function successCallback(apply) {
      console.log("同意")
      $rootScope.me.applyArray = $rootScope.me.applyArray.filter(function(apply) {
        return apply._id != _applyId
      })
      $rootScope.me.applyNumber--
    })
  }
  $rootScope.handleRefuse = function(apply) {
    console.log("refuse")
    console.log(apply)
    var _applyId = apply._id
    $http({
      url: '/api/handleApply',
      method: 'POST',
      data: {
        _applyId: _applyId,
        result: false
      }
    }).then(function successCallback(apply) {
      console.log("拒绝")
      $rootScope.me.applyArray = $rootScope.me.applyArray.filter(function(apply) {
        return apply._id != _applyId
      })
      $rootScope.me.applyNumber--
    })
  }
  $rootScope.$on('login', function(evt, me) {
    $rootScope.me = me
    $rootScope.me.password = null
  })
})
