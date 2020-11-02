const mongoose = require("mongoose"); 
var Schema = mongoose.Schema; 

mongoose.connect("mongodb://localhost:27017/test", 
{
    useNewUrlParser: true, 
    useFindAndModify: false, 
    useCreateIndex: true, 
    useUnifiedTopology: true
}).then(db => console.log("La Conexion se ha realizado Correctamente!!"))
.catch(err => console.log("error:", err))

var posibles_valores = ["M", "F"];

var email_match = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Coloca un email valido"];
var password_validation = {
        validator: function(pass){
            return this.password_confirmation == pass;
        },
        message: "Las contraseñas no son iguales"
    };

var user_schema = new Schema({
    name: String,
    last_name: String,
    username: {
        type: String, 
        required: true, 
        maxlength: [50, "User name demasiado largo"]
    },
    password: {
        type: String, 
        minlength: [8, "Contraseña muy corta"],
        validate: password_validation
    },
    age: {
        type: Number, 
        min:[18, "No puede ser menor de edad"], 
        max:[100, "Limite de edad"]
    },
    email: {
        type: String, 
        required: "Este campo es obligatorio", 
        match: email_match
    },
    date_of_birth: Date,
    sex: {
        type: String, 
        enum: {
            values: posibles_valores, 
            message:"Opcion no valida"}
        }
});

user_schema.virtual("password_confirmation").get(function(){
    return this.passConfirm;
}).set(function(password){
    this.passConfirm = password;
});

var User = mongoose.model("User",user_schema);

module.exports.User = User;