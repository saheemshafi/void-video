import multer from 'multer';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './public/temp'),
  filename: (req, file, cb) => {
    const filename = `${file.fieldname}-${crypto.randomUUID()}-${
      file.originalname
    }`;
    cb(null, filename);
  },
});

export default multer({ storage });
