const express= require('express'); // on a besoin d'express pr créer router
const router= express.Router();
const userCtrl = require('../controllers/user'); //besoin du controller pour associer les fcts aux différentes routes

router.post('/signup',userCtrl.signup);
router.post('/login',userCtrl.login);


module.exports=router;
