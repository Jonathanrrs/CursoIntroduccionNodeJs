var Imagen = require('../models/imagenes');
var owner_check = require('./image_permission');
module.exports = function (req, res, next) {
    Imagen.findById(req.params.id)
        .populate('creator')            //despues del findbyid que recibe el id de la imagen, se  hace populate y despues se ejecuta el query que contiene 2 caracteristicas, una encuentra el id, y ademas hace puplate de creator, que en bases de datos relacionales es como hacer un join
        .exec(function (err, imagen) {
            if (imagen != null && owner_check(imagen,req,res)) {
                //console.log('Encontré la imagen ' + imagen.creator);
                res.locals.imagen = imagen;
                next();
            }
            else {
                res.redirect('/app')
            }
        });

}