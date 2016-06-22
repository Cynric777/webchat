angular.module('webchatApp', ['ngRoute', 'angularMoment']).run(function($window, $rootScope, $http, $location) {
  $window.moment.locale('zh-cn')
  $location.path('/index')
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
  $rootScope.logout = function() {
    $http({
      url: '/api/logout',
      method: 'GET'
    }).then(function successCallback(user) {
      console.log("注销")
      $rootScope.me = null
      $location.path('/index')
    })
  }
  $rootScope.handle = function(apply) {
    var _applyId = apply._id
    $http({
      url: '/api/handle',
      method: 'POST',
      data: {
        _applyId: _applyId
      }
    }).then(function successCallback(apply) {
      console.log("已阅")
      $rootScope.me.agreeArray = $rootScope.me.agreeArray.filter(function(apply) {
        return apply._id != _applyId
      })
      $rootScope.me.refuseArray = $rootScope.me.refuseArray.filter(function(apply) {
        return apply._id != _applyId
      })
      $rootScope.me.applyNumber--
    })
  }
  $rootScope.handleAgree = function(apply) {
    console.log("agree")
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
  $rootScope.changeAvatarUrl = function() {
    $("#changeAvatarUrlModal").modal("show")
  }
  $rootScope.updateAvatarUrl = function() {
    $("#changeAvatarUrlModal").modal("hide")
    $http({
      url: '/api/avatar',
      method: 'POST',
      data: {
        username: $rootScope.me.username,
        password: $rootScope.me.password,
        avatarUrl: $("#newAvatarUrl").val()
      }
    }).then(function successCallback(data) {
      alert("修改头像成功")
    }, function errorCallback(data) {
      alert("修改头像失败")
    })
    $("#newAvatarUrl").val(null)
  }
  $rootScope.$on('login', function(evt, me) {
    $rootScope.me = me
  })
})
