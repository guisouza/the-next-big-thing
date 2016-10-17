function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

module.exports = function(socket){

  var data = {};

  data.id = guid();
  data.availableCores = 0;
  data.totalCores = 0;
  data.cores = 0;
  data.active = true;
  data.socket = socket;

  data.socket.on('availableCores', function(availableCores){
    data.availableCores = availableCores;
  })

  data.socket.on('totalCores', function(totalCores){
    data.totalCores = totalCores;
  })

  setTimeout(()=>{
    data.socket.emit('job');
  },5000)

  setTimeout(()=>{
    data.socket.emit('job');
  },10000)

  socket.on('disconnect', function(){
    data.active = false;
  });

  return {
    getStatus: function(){
      return data.active
    },
    getSocket: function(){
      return data.socket
    },
    getAvailableCores: function(){
      return data.availableCores;
    },
    getTotalCores: function(){
      return data.totalCores;
    },
    getId: function(){
      return data.id;
    }
  }
}
