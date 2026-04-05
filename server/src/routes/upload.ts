import { Router, Request, Response } from 'express';
import { authenticate, isOrganizer } from '../middleware/auth';
import { uploadEventImage } from '../middleware/upload';

const router = Router();

router.post(
  '/event-image',
  authenticate,
  isOrganizer,
  uploadEventImage.single('image'),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    const imageUrl = `/uploads/events/${req.file.filename}`;
    res.json({
      success: true,
      data: { imageUrl, filename: req.file.filename },
    });
  }
);

export default router;
