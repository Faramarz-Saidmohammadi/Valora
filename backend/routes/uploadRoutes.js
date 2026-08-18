import path from 'path';
import express from 'express';
import multer from 'multer';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`
    );
  },
});

function fileFilter(req, file, cb) {
  const extensionAllowed = /\.(jpe?g|png|webp)$/i.test(file.originalname);
  const mimeAllowed = /^image\/(jpeg|png|webp)$/i.test(file.mimetype);

  if (extensionAllowed && mimeAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_IMAGE_SIZE },
});

router.post('/', protect, admin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    return res.status(200).json({
      message: 'Image uploaded successfully',
      image: `/${req.file.path.replaceAll('\\', '/')}`,
    });
  });
});

export default router;
