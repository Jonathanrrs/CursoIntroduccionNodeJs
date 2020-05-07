var express = require('express');
var Imagen = require('./models/imagenes');
var router = express.Router();
var image_finder_middleware = require('./middlewares/find_image');
var fs = require('fs');
var redis = require('redis');

var client = redis.createClient();

//debemos a acceder a app.com/app/
router.get('/', function (req, res) {
    //Buscar el usuario que iniciado sesion
    //ya no se busca porque se hace por el middleware
    Imagen.find({})
        .populate('creator')
        .exec(function(err, imagenes){
            if(err) console.log(err);
            res.render('app/home', {imagenes: imagenes});  
        });
    //res.render('app/home');
});

//REST arquitectura, las acciones no estran definidads por la url, sino por el metodo del http
//get solictar archivo y mostrar
//put actualizar
//delete
//post crear

router.get('/imagenes/new', function (req, res) {
    res.render('app/imagenes/new');
});

router.all('/imagenes/:id*', image_finder_middleware);

router.get('/imagenes/:id/edit', function (req, res) {
    /*Imagen.findById(req.params.id, function(err,imagen) {  //vamos a eliminar esta consulta porque lo pasamos a otro archivo de find image y ya lo importamos a este,
                                                              asi que cuando se haga esa ruta se reemplazara en las de abajo tambien
        res.render('app/imagenes/edit', {imagen:imagen});
    });*/
    res.render('app/imagenes/edit'); //ya no necesitamos aqui pasar la imagen porque ya esta en los locals porque ya está en elñ archivo importado
});


router.route('/imagenes/:id')
    .get(function (req, res) {  //tenemos una vista show
        res.render('app/imagenes/show');
    })
    .put(function (req, res) {
        res.locals.imagen.title = req.body.title;  //aui utilizamos res.locals.
        res.locals.imagen.save(function (err) {
            if (!err) {
                res.render('app/imagenes/show');
            } else {
                res.render('app/imagenes/' + req.params.id + '/edit');
            }
        });
    })
    .delete(function (req, res) {
        //Eliminar fotos
        Imagen.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (!err) {
                res.redirect('/app/imagenes');
            }
            else {
                console.log(err);
                res.redirect('/app/imagenes' + req.params.id)

            }
        });
    });

router.route('/imagenes')
    .get(function (req, res) {
        Imagen.find({creator: res.locals.user._id}, function (err, imagenes) {
            if (err) {
                res.redirect('/app');
                return;
            }
            else {
                res.render('app/imagenes/index', { imagenes: imagenes });
            }
        });
    })
    .post(function (req, res) {  //aqui se crea la nueva imagen, esto del campo creador
        var extension = req.files.archivo.name.split('.').pop(); //para hacer la extension y asi guardar
        var data = {
            title: req.body.title,
            creator: res.locals.user._id,
            extension: extension
        }
        var imagen = new Imagen(data);
        imagen.save(function (err) {
            if (!err) {
                var imgJSON = {
                    'id': imagen._id,
                    'title': imagen.title,
                    'extension': imagen.extension
                };
                //client.publish('images', imagen.toString());
                client.publish('images', JSON.stringify(imgJSON));
                fs.rename(req.files.archivo.path, 'public/imagenes/'+imagen._id+'.'+extension, function(err) { //fs en 2020 necesita un callback en la funcion por eso no jalaba
                    res.redirect('/app/imagenes/' + imagen._id);
                });
                //res.redirect('/app/imagenes/' + imagen._id);
            }
            else {
                console.log(imagen);
                res.render(err);
            }
        });
    });













module.exports = router; //cuando es igual a un objeto o una variable esportamos el objeto