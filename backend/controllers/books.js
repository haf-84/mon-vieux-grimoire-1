const Book= require('../models/Book');
const fs= require('fs');

exports.getAllBooks= (req,res,next)=>{
    Book.find()
    .then(books => res.status(200).json(books)) // Renvoie un tableau de tous les livres de la base de données.
    .catch(error => res.status(400).json({error}))
};

exports.getBestRating = (req, res, next) => {
    Book.aggregate([
      { $unwind: "$averageRating" },
      { $sort: { averageRating: -1 } },
      { $limit: 3 },
    ])
      .then(books => {
        res.status(200).json(books);
      })
      .catch(error => {
        res.status(400).json({
          error: error,
        });
      });
};

exports.getOneBook= (req, res, next)=>{
    Book.findOne({_id : req.params.id })
    .then(book => res.status(200).json(book)) //Renvoie le livre avec l’_id fourni.
    .catch(error => res.status(404).json({error}));
};

exports.addRating=(req, res, next)=>{
    Book.findOne({ _id: req.params.id })
    .then(async book => {
      const user = req.body.userId;

      if (user !== req.auth.userId) {
        return res
          .status(403)
          .json({ error: "Vous ne pouvez pas voter pour ce livre." });
      }

      const newRatingObject = {
        userId: req.auth.userId,
        grade: req.body.rating,
        _id: req.body._id,
      };

      if (book.ratings.some(rating => rating.userId === req.auth.userId)) {
        return res
          .status(403)
          .json({ error: "Vous avez déjà voté pour ce livre." });
      } else {
        book.ratings.push(newRatingObject);
        const allRatings = book.ratings.map(rating => rating.grade);
        const newAverageRating = (
          allRatings.reduce((acc, curr) => acc + curr, 0) / allRatings.length
        ).toFixed(1);

        try {
          await Book.updateOne(
            { _id: req.params.id },
            { ratings: book.ratings, averageRating: newAverageRating },
            { new: true }
          );

          const updatedBook = await Book.findOne({ _id: req.params.id });
          return res.status(200).json(updatedBook);
        } catch (error) {
          throw error;
        }
      }
    })
    .catch(error => {
      return res.status(500).json({ error });
    });
};
  
exports.deleteBook = (req, res, next) => {
Book.findOne({ _id: req.params.id }).then(book => {
    if (book.userId != req.auth.userId) {
    res.status(401).json({ message: "Non autorisé" });
    } else {
    const filename = book.imageUrl.split("/images")[1];
    fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Livre supprimé" }))
        .catch(error => res.status(401).json({ error }));
    });
    }
});
  };

exports.createBook = (req, res, next) => {
    // Je parse la requete reçu au format string
    const bookObject = JSON.parse(req.body.book);
    // Suppression du id qui sera géré par la BDD 
    delete bookObject._id;
    // Suppression du userId car on récupèrera celui du token 
    delete bookObject._userId;
    // Je créé une nouvelle instance de mon modèle Book
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        // on génère l'url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // sauvgarde du nouveau livre dans la base de données 
    book.save()
    .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
    .catch(error => {res.status(400).json({ error })})
};

exports.modifyBook= (req,res,next)=>{
    const bookObject=req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    delete bookObject._userId;
    Book.findOne({_id:req.params.id})
    .then((book)=>{
        if(book.userId != req.auth.userId){
            res.status(401).json({message:'Non autorisé'});
        }else{
            Book.updateOne({_id:req.params.id},{...bookObject, _id:req.params.id})
            .then(()=>res.status(200).json({message:'Livre modifié avec succès'}))
            .catch(error=>res.status(401).json({error}));
        }
    })
    .catch(error => res.status(400).json({error}))
};

exports.deleteBook= (req,res,next)=>{
    Book.findOne({_id: req.params.id})
    .then((book)=>{
        if(book.userId != req.auth.userId){
            res.status(401).json({message:'Non autorisé'});
        }else{
            const filename=book.imageUrl.split('/images')[1];
            fs.unlink(`images/${filename}`,()=>{
                Book.deleteOne({_id:req.params.id})
                .then(()=>{res.status(200).json({message:'Livre supprimé'})})
                .catch(error=>res.status(401).json({error}));
            })
        }
    })
    .catch(error => res.status(400).json({error}))
};