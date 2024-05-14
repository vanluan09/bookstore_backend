const express = require('express');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const router = express.Router();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

const storage = new GridFsStorage({
  url: process.env.MONGO_DB,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'pdfBooks'
        };
        resolve(fileInfo);
      });
    });
  }
});


const upload = multer({ storage });

module.exports = upload
