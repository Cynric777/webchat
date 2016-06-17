angular.module('webchatApp').controller('IndexCtrl', function($scope, $http, $location) {
  $scope.login = function() {
    $http({
      url: '/api/login',
      method: 'POST',
      data: {
        username: $scope.loginUsername,
        password: $scope.loginPassword
      }
    }).then(function successCallback(user) {
      console.log("成功登陆")
      $scope.$emit('login', user.data)
      $location.path('/')
    }, function errorCallback(data) {
      if (data.data == 1) {
        alert("用户名不存在")
        $scope.loginUsername = null
      } else if (data.data == 2) {
        alert("密码错误")
        $scope.loginPassword = null
      } else {}
    })
  }
  $scope.register = function() {
    if ($scope.registerPassword.length < 6) {
      alert("密码至少6个字符")
      $scope.registerPassword = null
      $scope.registerRepeat = null
    }
    else if ($scope.registerPassword != $scope.registerRepeat) {
      alert("两次密码输入不一致")
      $scope.registerRepeat = null
    } else {
      $http({
        url: '/api/register',
        method: 'POST',
        data: {
          username: $scope.registerUsername,
          email: $scope.registerEmail,
          password: $scope.registerPassword
        }
      }).then(function successCallback(user) {
        console.log("成功登陆")
        $scope.$emit('login', user.data)
        $location.path('/')
      }, function errorCallback(data) {
        if (data.data == 1) {
          alert("用户名已存在")
          $scope.registerUsername = null
        } else if (data.data == 2) {
          alert("邮箱已被占用")
          $scope.registerEmail = null
        } else if (data.data == 3) {
          alert("用户名已存在\n邮箱已被占用")
          $scope.registerUsername = null
          $scope.registerEmail = null
        } else {}
      })
    }
  }
})
