import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: './public/data/uploads/',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  })
  
export const upload = multer({ storage })