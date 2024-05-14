const express = require("express");
const router = express.Router()
const ProductController = require('../controllers/ProductController');
const { authMiddleWare } = require("../middleware/authMiddleware");
const upload = require("./pdfRoute");


router.post('/create', upload.single("file"), ProductController.createProduct)
router.put('/update/:id', upload.single("file"), authMiddleWare, ProductController.updateProduct)
router.get('/get-details/:id', ProductController.getDetailsProduct)
router.get('/get-details-pdf/:id', ProductController.getDetailsProductPdf)
router.delete('/delete/:id', authMiddleWare, ProductController.deleteProduct)
router.get('/get-all', ProductController.getAllProduct)
router.post('/delete-many', authMiddleWare, ProductController.deleteMany)
router.get('/get-all-type', ProductController.getAllType)

module.exports = router