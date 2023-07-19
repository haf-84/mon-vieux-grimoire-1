const sharp= require('sharp');

// Middleware pour convertir l'image en WebP et redimensionner
const convertImageToWebP = (req, res, next) => {
    if (req.file && req.file.path) {
        sharp(req.file.path)
            .resize(800, 800, {
                fit: 'contain',
                withoutEnlargement: true
            }) // Redimensionner avec "contain"
            .webp() // Convertir l'image en WebP
            .toFile(req.file.path + '.webp', (err) => {
                if (err) {
                    console.error('Erreur lors de la conversion à WebP:', err);
                }
                req.file.webp=req.file.filename +'.webp'
                next();
            });
            console.log(req.file);
    } else {
        next();
    }
};

module.exports= convertImageToWebP;