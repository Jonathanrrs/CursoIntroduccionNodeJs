var socket = io(); //ejecutamos esta funcion para concectar el servidor de web socket

socket.on('new image', function(data) {
    data = JSON.parse(data);
    console.log(data);
    
    var container = document.querySelector("#imagenes");
    var source = document.querySelector("#image-template").innerHTML;
    var template = Handlebars.compile(source);
    container.innerHTML += template(data);
});