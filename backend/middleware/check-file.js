const multer = require('multer');

const MINE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MINE_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if(isValid){
            error = null;
        }
        callback(error, 'images');
    },
    filename: (req, file, callback) => {
        // to construct an unique filename for the picture
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MINE_TYPE_MAP[file.mimetype];
        callback(null, name +  '-' + Date.now() + '.' + ext);
    }
});


module.exports = multer({storage: storage}).single("image");