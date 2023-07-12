const express = require('express');
const router = express.Router();
const auth= require('../middleware/auth');
const multer= require('../middleware/multer-config');


const booksCtrl = require('../controllers/books');

//la logique métier se trouve dans controllers/books 

router.post('/', auth, multer, booksCtrl.createBook);
router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.get('/:id', auth, booksCtrl.getOneBook);
router.get('/', auth, booksCtrl.getAllBooks);

module.exports= router; 