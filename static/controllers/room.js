var loopSocket, username

angular.module('webchatApp').controller('RoomCtrl', function($scope, socket) {
  socket.on('roomData', function(room) {
    if (_.isEqual($scope.room, room) == false) {
      $scope.room = room
    }
  })

  socket.on('applyData', function(applyArray) {
    $scope.$parent.me.applyNumber = applyArray.length
    var _applyArray, _agreeArray, _refuseArray
    _applyArray = applyArray.filter(function(apply) {
      return apply.sponsor == false
    })
    _agreeArray = applyArray.filter(function(apply) {
      return (apply.sponsor == true && apply.result == true)
    })
    _refuseArray = applyArray.filter(function(apply) {
      return (apply.sponsor == true && apply.result == false)
    })
    if (_.isEqual($scope.$parent.me.applyArray, _applyArray) == false) {
      $scope.$parent.me.applyArray = _applyArray
    }
    if (_.isEqual($scope.$parent.me.agreeArray, _agreeArray) == false) {
      $scope.$parent.me.agreeArray = _agreeArray
    }
    if (_.isEqual($scope.$parent.me.refuseArray, _refuseArray) == false) {
      $scope.$parent.me.refuseArray = _refuseArray
    }
  })

  socket.on('friendData', function(friendArray) {
    var groupArray
    groupArray = _.toArray(_.groupBy(friendArray, function(friend) {
      return friend.groupname
    }))
    if (_.isEqual($scope.groupArray, groupArray) == false) {
      $scope.groupArray = groupArray
    }
  })

  socket.on('chatData', function(historyChatContent) {
    historyChatContent.msg = _.map(historyChatContent.msg, function(message) {
      message.createAt = (""+message.createAt).substring(0,10)+" "+(""+message.createAt).substring(11,19)
      return message
    })
    console.log(historyChatContent)
    _.find($scope.chatList, function(chat) {
      return chat.friend == historyChatContent.friend
    }).messages = historyChatContent.msg
  })

  $scope.chat = function(guest) {
    var chatRoom = {
      friend: guest,
      messages: []
    }
    if (_.find($scope.chatList, function(chat) {
      return chat.friend == guest
    }) == null) {
      $scope.chatList.push(chatRoom)
    }
    socket.emit('getHistoryChat', {
      host: $scope.$parent.me.username,
      guest: guest
    })
  }

  $scope.removeChat = function(guest) {
    $scope.chatList = $scope.chatList.filter(function(chat) {
      return chat.friend != guest
    })
    $("#home-tab").tab('show')
    $("#home").addClass("active in")
  }

  $scope.sendMessage = function(friend) {
    socket.emit('createMessage', {
      message: $("#messageTo"+friend).val(),
      sender: $scope.$parent.me.username,
      receiver: friend,
      avatarUrl: $scope.$parent.me.avatarUrl
    })
    $("#messageTo"+friend).val(null)
  }

  socket.on('online', function(user) {
    $scope.room.users.push(user)
  })

  socket.on('offline', function(user) {
    _userId = user._id
    $scope.room.users = $scope.room.users.filter(function(user) {
      return user._id != _userId
    })
  })

  socket.on('messageAdded'+$scope.$parent.me.username, function(message) {
    _.find($scope.chatList, function(chat) {
      return chat.friend == message.sender || chat.friend == message.receiver
    }).messages.push(message)
  })

  socket.on('messageAdded', function(message) {
    $scope.room.messages.push(message)
  })

  $scope.chatList = []
  username = $scope.$parent.me.username
  socket.emit('getRoom')
  socket.emit('getFriend', username)
  socket.emit('getApply', username)
  loopSocket = socket
  setInterval("loopSocket.emit('getRoom'); loopSocket.emit('getApply', username); loopSocket.emit('getFriend', username)", 5000)
})
