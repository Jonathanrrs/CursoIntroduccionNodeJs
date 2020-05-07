var express = require('express');
var bodyParser = require('body-parser');
var User = require('./models/user').User; //aqui es donde lo importamos de user.js
//var cookieSession = require('cookie-session'); //ya no se usara por redis, sera express session
var session = require('express-session');
var router_app = require('./routes_app');
var session_middleware = require('./middlewares/session');
var formidable = require('express-form-data'); //es para subir las imagenes, el formidable require ya no jala con esta sintaxis del video viejo
var redis = require('redis');
var RedisStore = require('connect-redis')(session) //usamos redict y ya no usaremos cokies session, necesitamos pasar com oargumento la variable que importa express session
let redisClient = redis.createClient();  //Esto se necesita para el uso de sesiones en redis, lo encontré en la documentacion de npm
var http = require('http'); //es para socket, porque el server es de socket, no debe ser express
var methodOverride = require('method-override'); //esto es la extension para el put, es n middleware para que envie los atributos y se pueden modificar, y pse usen los metodos de http
var realtime = require('./realtime'); //importamos el modulo de realtime

var app = express();
var server = http.Server(app);

var sessionMiddleware = session({  //aqui se almacenaran las sessiones en redit
    store: new RedisStore({client: redisClient}),
    secret: 'super ultra secret word'
});

realtime(server, sessionMiddleware); //tanto socket.io y express compartan la misma sesion, y el mismo usuario que encontramos en expreess lo podamos encontrar en socket.io

app.use(express.static('public')); //para montar un middleware debemos pasarlo como parametro //static retornar el middleware que se va a montar ahí, y permite servir archivos estaticos, los estaticos son los archivos que no cambian, como imagnes,css,js 
//se debe montar en un carpeta, en este caso public, no es obligatorio ese nombre
app.use(bodyParser.json()); //para peticiones applicatuin/json
app.use(bodyParser.urlencoded({ extended: true })); //con el extendend: dependiendo si es falso o verdadero define con qué algoritmo va ahacer el parsing la libreria, en falso no s epuede hacer arreglos, o params que no sean json //con true sí

app.use(methodOverride('_method'));
app.use(sessionMiddleware);

/*app.use(cookieSession( { //aqui ejecutamos el require de cookie       Ya no se usa ahora redis
    name: 'session',
    keys: ['llave-1', 'llave-2']

}));*/

//keepExtensions para despues gaurdar la extension del archivo que el usuario subio, cuando mueva el archivo a la carpeta temporal que mantenga la extension del mismo
app.use(formidable.parse({ keepExtensions: true}));
//donde se almacena, se suele en una carpeta temporal

app.set('view engine', 'jade');
//todo los demas es transparante, no es necesaria modificar la forma en como extramos la forma de los datos, en lugar de las sesionesa^^^

app.get('/', function (req, res) {
    console.log(req.session.user_id);
    
    res.render('index');
});
app.get('/signup', function (req, res) {
    User.find(function (error, doc) {
        console.log(doc);
        res.render('signup'); //registro
    });
});
app.get('/login', function (req, res) {
        res.render('login');
});

app.post('/users', function (req, res) {
    var user = new User({
        email: req.body.email,
        password: req.body.password,
        password_confirmation: req.body.password_confirmation,
        username: req.body.username
    });
    console.log(user.password_confirmation);
    //Actualmente se usan las promesas
    user.save().then(function(us) {  //en lugar de recibir un callback retorna una promesa
        res.send('Guardamos el usuario exitosamente');
    }, function(err) {
        console.log(String(err));
        res.send('Hubo un error al guardar el usuario')
        
    });
});

app.post('/sessions', function(req, res) {
    User.findOne({email:req.body.email, password:req.body.password},function(err, user) {
        req.session.user_id = user._id;
        res.redirect('/app');
    });
});

app.use('/app', session_middleware);
app.use('/app', router_app);
server.listen(8080); //en lugar de que la app reciba las peticiones mejor sea el sevrvidor
