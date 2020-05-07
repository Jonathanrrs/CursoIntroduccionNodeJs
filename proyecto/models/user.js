var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/mystore');

var posibles_valores = ['M', 'F'];
var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Coloca un email válido'];
var password_validation = {
    validator: function (p) {
        return this.password_confirmation == p;
    },
    message: 'Las contraseñas no son iguales'
}
var user_schema = new Schema({
    name: String,
    last_name: String,
    username: { type: String, required: true, maxlength: [50, 'Username muy grande'] },
    password:
    {
        type: String,
        minlength: [8, 'El password es muy corto'],
        validate: password_validation
    },
    age: { type: Number, min: [5, 'La edad no puede ser menor a 5'], max: [100, 'La edad no puede ser mayor a 100'] },
    email: { type: String, required: 'El correo es obligatorio', match: email_match }, //validaciones
    date_of_birth: Date,
    sex: { type: String, enum: { values: posibles_valores, message: 'Opcioón no válida' } }
});
//get establecer como se accede a un atributo
//set establecer la logica a traves de la cual se asigna un valor al atributo
user_schema.virtual('password_confirmation').get(function () {
    return this.p_c;
}).set(function (password) {
    this.p_c = password;
});

user_schema.virtual('full_name').get(function () {
    return this.name + this.last_name;
}).set(function (full_name) {
    var words = full_name.split(' ');
    this.name = words[0];
    this.last_name = words[1];
});

var User = mongoose.model('User', user_schema) //model es el construcuturor qu egenera los modelos, el primer params que recibe es el nombre del modelo y el 2do el esquema que generamos

module.exports.User = User;






