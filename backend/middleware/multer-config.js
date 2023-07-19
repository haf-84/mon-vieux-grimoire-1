const multer= require('multer');

const MIME_TYPES={
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
    'image/png':'png',
    'image/webp':'webp'
};

const storage= multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null, 'images')
    },
    filename:(req,file,callback)=>{
        const name= file.originalname.split(' ').join('_');
        const extension= MIME_TYPES[file.mimetype];
        callback(null, name+ Date.now() + '.' + extension);
    }
});

const fileFilter= (req,file,callback)=>{
    if(file.mimetype.startsWith('image/')){
        callback(null,true);
    }else{
        callback(new Error('Seuls les images sont autorisées'),false);
    }
}

module.exports= multer({
    storage,
    fileFilter
}).single('image');

