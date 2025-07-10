const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'image') {
      cb(null, 'uploads/services/images');
    } else if (file.fieldname === 'tutorialVideo') {
      cb(null, 'uploads/services/videos');
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `service-${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file hình ảnh!'), false);
    }
  } else if (file.fieldname === 'tutorialVideo') {
    // Allow only video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file video!'), false);
    }
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: file => {
      if (file.fieldname === 'image') {
        return 5 * 1024 * 1024; // 5MB limit for images
      } else if (file.fieldname === 'tutorialVideo') {
        return 100 * 1024 * 1024; // 100MB limit for videos
      }
    }
  }
});

module.exports = upload; 