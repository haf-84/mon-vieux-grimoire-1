const mongoose = require('mongoose');

//création du schéma de données

const bookSchema = mongoose.Schema(
    {
        userId : {type: String}, //identifiant MongoDB unique de l'utilisateur qui a créé le livre
        title : {type: String, required:true}, 
        author : {type: String, required: true},
        imageUrl :{type: String, required: true },
        year:{type:Number, required: true},
        genre: {type:String,required: true},
        ratings : [
        {
            userId : {type: String}, //identifiant MongoDB unique de l'utilisateur qui a noté le livre
            grade : {type:Number, required: true} //note donnée à un livre
        }
        ], 
        averageRating : {type: Number} // note moyenne du livre
    }
);

//export du modèle correspondant 

module.exports = mongoose.model('Thing',bookSchema);