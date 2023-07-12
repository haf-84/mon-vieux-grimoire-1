const mongoose= require('mongoose');

const uniqueValidator= require('mongoose-unique-validator'); // on applique ce validator au schema avant d'en faire un modele (ce plugin permet d'être sur que l'adresse mail est unique)

const userSchema= mongoose.Schema({
    email : {type: String, required:true, unique:true }, // adresse e-mail de l’utilisateur [unique]
    password : {type: String, required: true}// mot de passe haché de l’utilisateur
});

userSchema.plugin(uniqueValidator);

module.exports=mongoose.model('User',userSchema);