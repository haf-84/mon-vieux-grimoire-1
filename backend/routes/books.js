const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/books');
const auth= require('../middleware/auth');
const multer= require('../middleware/multer-config');
const convertImageToWebP=require('../middleware/convert-to-webp');



//la logique métier se trouve dans controllers/books 

router.post('/', auth, multer,convertImageToWebP,booksCtrl.createBook);
router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating',booksCtrl.getBestRating);
router.get('/:id', booksCtrl.getOneBook);
router.post('/:id/rating',auth,booksCtrl.addRating);
router.put('/:id', auth, multer,convertImageToWebP,booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports= router; 