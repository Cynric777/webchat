var express = require('express')
var async = require('async')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var app = express()
var path = require('path')
var port = process.env.PORT || 3000
var Controllers = require('./controllers')
var signedCookieParser = cookieParser('webchat')
var MongoStore = require('connect-mongo')(session)
var sessionStore = new MongoStore({
  url: 'mongodb://localhost/webchat'
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cookieParser())
app.use(session({
  secret: 'webchat',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 1000
  },
  store: sessionStore
}))

app.use(express.static(path.join(__dirname, '/static')))

app.get('/api/validate', function(req, res) {
  console.log("in validate")
  var _userId = req.session._userId
  if (_userId) {
    Controllers.User.findUserById(_userId, function(err, user) {
      if (err) {
        res.json(401, {
          msg: err
        })
      } else {
        res.json(user)
      }
    })
  } else {
    res.status(401).json(null)
  }
})

app.post('/api/login', function(req, res) {
  console.log("in login")
  var username = req.body.username
  var password = req.body.password
  if (username && password) {
    Controllers.User.checkPassword(username, password, function(err, user) {
      if (err) {
        res.status(401).json(err)
      } else {
        req.session._userId = user._id
        req.session._username = user.username
        Controllers.User.online(user._id, function(err, user) {
          if (err) {
            res.status(500).json({
              msg: err
            })
          } else {
            res.json(user)
          }
        })
      }
    })
  } else {
    res.status(401).json(null)
  }
})

app.post('/api/register', function(req, res) {
  console.log("in register")
  var username = req.body.username
  var email = req.body.email
  var password = req.body.password
  var msg = 0
  if (username && email && password) {
    Controllers.User.findUserByName(username, function(err, user) {
      if (user) {
        msg += 1
      }
      Controllers.User.findUserByEmail(email, function(err, user) {
        if (user) {
          msg += 2
        }
        if (msg) {
          res.status(403).json(msg)
        } else {
          Controllers.User.createUser(username, email, password, function(err, user) {
            if (err) {
              res.status(500).json({
                msg: err
              })
            } else {
              req.session._userId = user._id
              req.session._username = user.username
              Controllers.Group.createGroup("我的好友", username, null)
              Controllers.User.online(user._id, function(err, user) {
                if (err) {
                  res.status(500).json({
                    msg: err
                  })
                } else {
                  res.json(user)
                }
              })
            }
          })
        }
      })
    })
  } else {
    res.status(401).json(null)
  }
})

app.get('/api/logout', function(req, res) {
  console.log("in logout")
  _userId = req.session._userId
  Controllers.User.offline(_userId, function(err, user) {
    if (err) {
      res.json(500, {
        msg: err
      })
    } else {
      res.json(user)
      delete req.session._userId
      delete req.session._username
    }
  })
})

app.post('/api/handle', function(req, res) {
  console.log("in handle")
  var _applyId = req.body._applyId
  Controllers.Apply.handle(_applyId, function(err, apply) {
    if (err) {
      res.status(500).json({
        msg: err
      })
    } else {
      res.json(null)
    }
  })
})

app.post('/api/handleApply', function(req, res) {
  console.log("in handleApply")
  var _applyId = req.body._applyId
  var result = req.body.result
  Controllers.Apply.handleApply(_applyId, result, function(err, apply) {
    if (err) {
      res.status(500).json({
        msg: err
      })
    } else {
      apply.result = result
      if (result == true) {
        var avatarUrlOfHost, avatarUrlOfGuest
        Controllers.User.getAvatarUrlOfUser(apply.host, function(err, user) {
          avatarUrlOfHost = user.avatarUrl
          Controllers.User.getAvatarUrlOfUser(apply.guest, function(err, user) {
            avatarUrlOfGuest = user.avatarUrl
            Controllers.Group.addFriend(apply, avatarUrlOfHost, avatarUrlOfGuest, null)
          })
        })
      }
      Controllers.Apply.createApproval(apply, null)
      res.json(null)
    }
  })
})

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, './static/index.html'))
})

var server = app.listen(port, function() {
  console.log('webchat is on port' + port)
})

var io = require('socket.io').listen(server)
var messages= []

io.set('authorization', function(handshakeData, accept) {
  signedCookieParser(handshakeData, {}, function(err) {
    if (err) {
      accept(err, false)
    } else {
      sessionStore.get(handshakeData.signedCookies['connect.sid'], function(err, session) {
        if (err) {
          accept(err.message, false)
        } else {
          handshakeData.session = session
          if (session._userId) {
            accept(null, true)
          } else {
            accept('No login')
          }
        }
      })
    }
  })
})

io.sockets.on('connection', function(socket) {
  var _userId = socket.request.session._userId
  var _username = socket.request.session._username
  Controllers.User.online(_userId, function(err, user) {
    if (err) {
      socket.emit('err', {
        msg: err
      })
    } else {
      socket.broadcast.emit('online', user)
    }
  })
  socket.on('disconnect', function() {
    Controllers.User.offline(_userId, function(err, user) {
      if (err) {
        socket.emit('err', {
          msg: err
        })
      } else {
        socket.broadcast.emit('offline', user)
      }
    })
  })

  socket.on('search', function(username) {
    Controllers.User.findUserByName(username, function(err, user) {
      var result = false
      if (user) {
        result = true
        socket.emit('searchResult', {
          result: result,
          username: user.username,
          avatarUrl: user.avatarUrl
        })
      } else {
        socket.emit('searchResult', {
          result: result
        })
      }
    })
  })

  socket.on('apply', function(username) {
    Controllers.Apply.createApply(username, _username, null)
  })

  socket.on('getRoom', function() {
    async.parallel([
      function(done) {
        Controllers.User.getOnlineUsers(done)
      },
      function(done) {
        Controllers.Message.read(done)
      }
    ],
    function(err, results) {
      if (err) {
        socket.emit('err', {
          msg: err
        })
      } else {
        var friendList = []
        for (var i = 0; i < results[0].length; i++) {
          friendList[i] = {
            username: results[0][i].username,
            avatarUrl: results[0][i].avatarUrl,
            online:results[0][i].online
          }
        }
        socket.emit('roomData', {
          users: friendList,
          messages: results[1]
        })
      }
    })
  })

  socket.on('getApply', function(username) {
    Controllers.Apply.findApplyByHost(username, function(err, applyArray) {
      socket.emit('applyData', applyArray)
    })
  })

  socket.on('getFriend', function(username) {
    Controllers.Group.findGroupByHost(username, function(err, friendArray) {
      socket.emit("friendData", friendArray)
    })
  })

  socket.on('createMessage', function(message) {
    Controllers.Message.create(message, function(err, message) {
      if (err) {
         socket.emit('err', {
           msg: err
         })
      } else {
        io.sockets.emit('messageAdded', message)
      }
    })
  })
})
