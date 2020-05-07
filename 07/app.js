var express = require('express');

var app = express();
app.get('/', function(req, res) {
    res.send('Hello world') //cierra la conexiony y ya no hace falta cerrarlo con end
})
app.listen(8080) //no se ha declaro esa direccion o ese path
