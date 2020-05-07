const express = require('express');
var app = express();
app.set('view engine', 'jade');
//Método http  baja el cual se hacen las peticiones
//Diferentes verbos http: GET y POST, PUTH, PATCH, OPTIONS, HEADERS, DELETE
//Se altera el verbo con los encabezados de la petición
//Express solo tiene GET y POST
//Estos verbos conforman una arquitectura rest
app.get('/', function(req, res) {
res.render('index');
});
app.get('/:nombre', function(req, res) { //ejecuta esta funcion simempre que haya una diagonal y despues un texto
    res.render('form', {nombre: req.params.nombre}); //se le pasa el valor de ese dato y asi se recupera el valor que viene de la url
    });
app.post('/', function(req, res) { //otra forma de declarar una ruta, el post solo va entrar aqui cuando la funcion sea post
    res.render('form');

})
app.listen(8080);