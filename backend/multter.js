const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads');
  },
  filename: function(req, file, cb){
    const uniquesuffix = Date.now() + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split('.')[0];
    cb(null, filename + '_' + uniquesuffix + '.png');
  },
});

exports.upload = multer({ storage: storage });