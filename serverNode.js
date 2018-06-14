#!/usr/bin/env node
var jsonfile = require('jsonfile')
var express = require('express');
var app = express();
var server     = require('http').createServer(app),
    io         = require('socket.io')(server),
    logger     = require('winston'),
    port       = process.env.PORT || 3000;

// Logger config
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, { colorize: true, timestamp: true });
logger.info('SocketIO > listening on port ' + port);

io.on('connection', function (socket){
    var nb = 0;

    logger.info('SocketIO > Connected socket ' + socket.id);

    socket.on('disconnect', function () {
        logger.info('SocketIO : Received ' + nb + ' messages');
        logger.info('SocketIO > Disconnected socket ' + socket.id);
    });

    socket.on ('start_main', function (data) {
      console.log("boton empezar ")
      jsonfile.writeFile('main.json', data, function (err) {
        console.error('error: ',err)
      })
    });

    socket.on ('audio', function (data) {
      console.log("escuchoo: ", data)
      jsonfile.writeFile('audio.json', data, function (err) {
        console.error('error: ',err)
      })
    });
});



server.listen(port, function(){
    logger.info('Conexion al server');
});


app.post('/ReceiveJSON', function(request, response){
    //var texto = request.bodyParser
  //console.log(texto);
  io.emit("reset");
  response.send("ok");
});

app.get('/',function(request, response){
  response.send('hello express');
  console.log('llegó');
});

// app.listen(1337, function(){
//   console.log('Server Express Ready!');
// });

