Esta es la creación del proyecto


var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var User = mongoose.model('User', user_schema) //Ya no se necesita porque lo exportamos del archivo user
/*var mongoose = require('mongoose'); //funcionan mapeando un modelo con una tabla
var Schema = mongoose.Schema;*/
/*var userSchemaJSON = {
    email: String,
    password:String
};
var user_schema = new Schema(userSchemaJSON);
var User = mongoose.model('User', user_schema)*/
var User = require('./models/user').User; //aqui es donde lo importamos de user.js






app.use(express.static('public')); //para montar un middleware debemos pasarlo como parametro //static retornar el middleware que se va a montar ahí, y permite servir archivos estaticos, los estaticos son los archivos que no cambian, como imagnes,css,js 
//se debe montar en un carpeta, en este caso public, no es obligatorio ese nombre
app.use(bodyParser.json()); //para peticiones applicatuin/json
app.use(bodyParser.urlencoded({extended: true})); //con el extendend: dependiendo si es falso o verdadero define con qué algoritmo va ahacer el parsing la libreria, en falso no s epuede hacer arreglos, o params que no sean json //con true sí
app.set('view engine', 'jade');

app.get('/', function(req, res) {
    res.render('index');
});
app.get('/login', function(req, res) {
    User.find(function(error, doc) {
        console.log(doc);
        res.render('login');
    });
    
});

/*app.post('/users', function(req, res) {
    console.log(`Contraseña: ${req.body.password}`); //para leer los params, los identificadores están definidos por los atributos name en el archivo jade, en el servidor estan dentro de un nuevo objeto llamdao body, body tienen propiedades que mapean a los atributos que se mandaron en la peticion
    console.log(`Email: ${req.body.email}`);
    res.send('Recibimos tus datos');
});*/

app.post('/users', function(req, res) {
    var user = new User({email: req.body.email, password: req.body.password});
    user.save(function(){
        res.send('Guardamos tus datos');
    });
});
app.listen(8080);

////////
app.post('/users', function (req, res) {
    var user = new User({
        email: req.body.email,
        password: req.body.password,
        password_confirmation: req.body.password_confirmation,
        username: req.body.username
    });
    console.log(user.password_confirmation);
    /*user.save(function(err) {
        if (err) {
            console.log(String(err));
        }
        res.send('Guardamos tus datos');
    });*/
    //Actualmente se usan las promesas
    user.save().then(function(us) {  //en lugar de recibir un callback retorna una promesa
        res.send('Guardamos el usuario exitosamente');
    }), function(err) {
        console.log(String(err));
        res.send('No pudimos guardar la información')
        
    }
});
app.listen(8080);
--------------------------------------------
No se debe validar en el html, está bien pero no es lo mejor, lo mejor es el backend
En el controlador tampoco los controladores

Para el manejo de sesiones instalar
npm install express-sesion --save

center-block ahora es mx-auto(bootstrap)

---------------------------------------------------
var express = require('express');
var bodyParser = require('body-parser');
var User = require('./models/user').User; //aqui es donde lo importamos de user.js
var session = require('express-session'); //ya no se usará, ahora será cookies
var router_app = require('./routes_app');
var session_middleware = require('./middlewares/session');

app.use(session({
    secret: '123jonajona', 
    resave: false, //estos daban advertenccias en la consola        se reemplaza por la coockie
    saveUninitialized: false //advertencia
}));

//Para instalar nodemon hacemos el comando//
npm install nodemon -D
y para correr el sevidor
es npx nodemon "nombre archivo"

-----------------
Los navegadores por defecto solo aceptan el metodo post
y por lo tanto debemos hacer que acepte los otros, en este caso el put
debemos instalar una nueva dependencia 
npm install method-override --save

------------
  p Por #{imagen.creator.email}
  aqui creator no se trata como un string, sino como un objeto que representa alusuario que subio esa imagen

  -----------
    npm install express-formidable --save
    enctype="multipart/form-data aqui se van enviar datos de un archivo, sin este no se enviarian los del archivo

    npm install --save express-form-data ya no sirve el actual del tutorial,está desactualizado

--------------
express es http
socket.io es websocket

 npm install --save socket.io

 utilizamos pupsu porrque hay una parte que publica y otra que se suscribe

 npm install handlebars
 ---------
extends ../layout.jade
block contenido
    div(id="imagenes")
        for imagen in imagenes
            div(class="img-container")
                a(href="/app/imagenes/#{imagen._id}")
                    h2= imagen.title
                img(src="/imagenes/#{imagen._id}.#{imagen.extension}", class="main-img")
                if(typeof imagen.creator != 'undefined') 
                    p Por #{imagen.creator.email}
    script(id="image-template" type="text/x-handlebars-template")
        div(class="img-container")
            a(href="/app/imagenes/{{id}}")
                h2 {{title}}
            img(src="/imagenes/{{id}}.{{extension}}", class="main-img")
    script(src="/js/client.js")