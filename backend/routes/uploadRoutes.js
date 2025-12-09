import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Configure multer to use memory storage (store files in memory as Buffer)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});



// Upload single image to Cloudinary
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload to Cloudinary using upload_stream
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'livique-products', // Organize images in a folder
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' }, // Limit max dimensions
            { quality: 'auto' }, // Auto quality optimization
            { fetch_format: 'auto' } // Auto format selection
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      // Write the buffer to the stream
      uploadStream.end(req.file.buffer);
    });

    const result = await uploadPromise;

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error uploading image to Cloudinary',
      error: error.message 
    });
  }
});

// Upload multiple images to Cloudinary
router.post('/upload-multiple', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    // Upload all images to Cloudinary
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'livique-products',
            transformation: [
              { width: 1000, height: 1000, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        uploadStream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    const uploadedImages = results.map(result => ({
      url: result.secure_url,
      public_id: result.public_id,
    }));

    res.status(200).json({
      success: true,
      images: uploadedImages,
    });
  } catch (error) {
    console.error('Cloudinary multiple upload error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error uploading images to Cloudinary',
      error: error.message 
    });
  }
});

// Delete image from Cloudinary
router.delete('/delete/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    const decodedPublicId = decodeURIComponent(publicId);
    
    const result = await cloudinary.uploader.destroy(decodedPublicId);
    
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting image from Cloudinary',
      error: error.message 
    });
  }
});

export default router;
