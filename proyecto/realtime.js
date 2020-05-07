module.exports = function(server, sessionMiddleware) {
    var io = require('socket.io')(server) //como redis ocupaba session aqui el server
    var redis = require('redis');
    var client = redis.createClient();

    client.subscribe('images');

    io.use(function(socket, next) {
        sessionMiddleware(socket.request, socket.request.res, next) //con esto se configura nuestra socket para que se compoarta la sesion con espress
    });

    client.on('message', function(channel, message) {
        if(channel=='images') {
            io.emit('new image', message)
        }

    });
    io.sockets.on('connection', function(socket) {
        console.log(socket.request.session.user_id);
        
    });
}

//Es la logica de socket.io