const express = require('express');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const booksRoutes= require('./routes/books');
const userRoutes= require('./routes/user');

mongoose.connect('mongodb+srv://hafidahias:YAPw9m5ItawxKcCQ@cluster0.wjmnipi.mongodb.net/?retryWrites=true&w=majority',{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app= express() //permet de créer appliation express

app.use(express.json());

//Gérer les erreurs CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

app.use(bodyParser.json());

app.use('/api/books',booksRoutes); 
app.use('/api/auth',userRoutes);
app.use('/images',express.static(path.join(__dirname,'images')));

module.exports=app;