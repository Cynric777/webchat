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
  var email = req.body.email
  if (email) {
    Controllers.User.findByEmailOrCreate(email, function(err, user) {
      if (err) {
        res.json(500, {
          msg: err
        })
      } else {
        req.session._userId = user._id
        Controllers.User.online(user._id, function(err, user) {
          if (err) {
            res.json(500, {
              msg: err
            })
          } else {
            res.json(user)
          }
        })
      }
    })
  } else {
    res.json(403)
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
        socket.emit('roomData', {
          users: results[0],
          messages: results[1]
        })
      }
    })
  })
  //   Controllers.User.getOnlineUsers(function(err, users) {
  //     if (err) {
  //       socket.emit('err', {
  //         msg: err
  //       })
  //     } else {
  //       socket.emit('roomData', {
  //         users: users,
  //         messages: messages
  //       })
  //     }
  //   })
  // })
  //
  // socket.on('getAllMessages', function() {
  //   socket.emit('allMessages', messages)
  // })
  // socket.on('createMessage', function(message) {
  //   messages.push(message)
  //   socket.emit('messageAdded', message)
  // })
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
