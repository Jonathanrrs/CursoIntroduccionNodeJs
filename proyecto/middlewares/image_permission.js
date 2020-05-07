var Imagen = require('../models/imagenes');

module.exports = function(image, req, res) { //recibimos la imagen con id del usuario
    // True = Tienes los permisos
    // Flaso = Si ni tienes permisis

    if(req.method === 'GET' && req.path.indexOf('edit') < 0) {
        // Ver la imagen
        return true;
    }
    
    if( typeof image.creator == 'undefined') {
        return false;
    }

    if(image.creator._id.toString() == res.locals.user._id) { //se obtiene el id porque la imagen es la que se construye del populate, creator es un objeto y no id y por eso lo convertimos a string
        // esta imagen yo la subí
        return true;
    }

    return false;
}