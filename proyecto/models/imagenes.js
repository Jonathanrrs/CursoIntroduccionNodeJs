var moongose = require('mongoose');
var Schema = moongose.Schema;

var img_schema = new Schema( {
    title: {type:String, required:true},
    creator: {type: Schema.Types.ObjectId, ref: 'User'}, //Aqui le agregamos un nuevo campo al esquema, será el usuario, su tipo de dato es schema, la linea significa como si fuera una llave foranea, ese el id de otro objeto y hace referencia al modelo user
    extension:{type: String, required:true}
});

var Imagen = moongose.model('Imagen', img_schema);

module.exports = Imagen;

