const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'war-economic-impact',
  api_key: process.env.CLOUDINARY_UPLOAD_PRESET,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage for buffer-based upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, GIF, and PDF are allowed.'));
    }
  },
});

const uploadToCloudinary = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const stream = cloudinary.uploader.upload_stream(
    {
      folder: 'war_economic_impact',
      resource_type: 'auto',
    },
    (error, result) => {
      if (error) {
        console.error('Cloudinary Upload Error:', error);
        return res.status(500).json({ error: 'Upload failed' });
      }
      res.status(200).json({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          size: result.bytes,
        },
      });
    }
  );

  stream.end(req.file.buffer);
};

module.exports = {
  upload,
  uploadToCloudinary,
};
