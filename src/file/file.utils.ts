import { diskStorage } from 'multer';
import * as path from 'path';

export const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${extension}`);
  },
});
