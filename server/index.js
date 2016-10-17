var express = require('express');
var http = require('http');
var socket = require('socket.io');
var Client = require('./client');

const app = express();
const server = http.Server(app);
const io = socket(server);

var data = {
  availableCores: 0,
  clients: []
}

function refreshActives(){
  data.availableCores = data.clients.reduce((acc,cl)=>{
    clCores = cl.getAvailableCores();
    return acc+clCores;
  },0)

}

function cleanInactives(){
  data.clients = data.clients.filter(cl=>{
    return cl.getStatus();
  });
}



io.on('connection', function(socket){
  var newClient = Client(socket);
  data.clients.push(newClient)
  refreshActives();
  socket.on('disconnect', function(){
    cleanInactives();
  });
});

setInterval(()=>{
  console.log(data.clients.map(cl=>{
    return {
      id : cl.getId(),
      totalCores : cl.getTotalCores(),
      availableCores : cl.getAvailableCores(),
    }
  }));
  refreshActives();
},1000);


server.listen(8800, function(){
  console.log('listening on *:8800');
});
