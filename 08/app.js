//motores de vista
//se utiliza jade
//npm install jade --save

//index.jade
//el igual ejecuta el codigo de js pero also lo imprime

const express = require('express');
var app = express();
app.set('view engine', 'jade');

app.get('/', function(req, res) {
res.render('index', {hola:'Hola jonathan'})
});
app.listen(8080);

//jade no deja meter comentarios y ya esta descontinuado, se usa pug 
//el !nos permite agregar texto html, sin eso es una cadena escapada
//lo ideal es meter lo de html en un archivo de html
//# interpolacion con ese signo, podemos combinar un string e interpolarlo con codido de js
//debemos poner el punto y despues utilizar la interpolacion de tags
//each es como un ciclo for in, no hay una variable iteradora, sino que va tomando el valor de cada cosa adentro
// item pasamos un valor al case y lo que deba hacer cuando tenga el valor
