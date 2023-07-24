import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { MulterError, diskStorage } from 'multer';
import { extname, join } from 'path';

export const ImageUploadConfig: MulterOptions = {
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) cb(null, true);
    else {
      cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
    }
  },
  limits: {
    fieldSize: 1024 * 1024 * 4,
  },
  storage: diskStorage({
    destination: join(__dirname, '../../', 'public/uploads'),
    filename: function (_, file, cb) {
      const name = file.originalname.split('.')[0];
      const ext = extname(file.originalname);
      const url = name + '-' + Date.now() + ext;
      cb(null, url);
    },
  }),
};
