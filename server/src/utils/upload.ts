import multer from 'multer';
import path from 'path';

const upload = (des: string, id: string) => {
  const storage = multer.diskStorage({
    destination: des,
    filename: (req, file, cb) => {
      cb(null, file.originalname.split('.')[0] + '-' + Date.now() + '-' + path.extname(file.originalname));
    }
  });

  const uploadMulter = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      !['image/png'].includes(file.mimetype)
        ? cb(null, true)
        : cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'not a PNG'));
    }
  }).array(id);

  return uploadMulter;
};

export default upload;
