const express = require('express');
const router = express.Router();
const { upload, uploadToCloudinary } = require('../controllers/uploadController');

router.post('/', upload.single('file'), uploadToCloudinary);

module.exports = router;
