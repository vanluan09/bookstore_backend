const ProductService = require('../services/ProductService')


const createProduct = async (req, res) => {
    try {
   
        const { name, image, type, countInStock, price, description} = req.body
        if (!name || !image || !type || !countInStock || !price ) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }

        if(req.file) {
            const pdfBook = req.file.id
            const response = await ProductService.createProduct({name, image, type, countInStock, price, description, pdfBook})
            return res.status(200).json(response)
        }
        else {
            const response = await ProductService.createProduct({name, image, type, countInStock, price, description})
            return res.status(200).json(response)
        }
        
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const { name, image, type, countInStock, price, description} = req.body
        if(req.file) {
            const pdfBook = req.file.id
            if (!productId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The productId is required'
                })
            }
            const response = await ProductService.updateProduct(productId, {name, image, type, countInStock, price, description, pdfBook})
            return res.status(200).json(response)
        }
        else {
            if (!productId) {
                return res.status(200).json({
                    status: 'ERR',
                    message: 'The productId is required'
                })
            }
            const response = await ProductService.updateProduct(productId, {name, image, type, countInStock, price, description})
            return res.status(200).json(response)
        }
    } catch (e) {
        console.log('e controller', e)
        return res.status(404).json({
            
            message: e
        })
    }
}

const getDetailsProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.getDetailsProduct(productId)
        return res.status(200).json(response)
        
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error'
        });
    }
}

const getDetailsProductPdf = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.getDetailsProduct(productId)
        
        if(response.status === 'OK') {
            // Check if the product contains a PDF file
            if (response.data.pdfBook) {
                // Get and display the PDF
                const pdfStream = await ProductService.getPDF(response.data.pdfBook)
                res.setHeader('Content-Type', 'application/pdf');
                pdfStream.pipe(res);
            } else {
                return res.status(404).json({
                    status: 'ERR',
                    message: 'No PDF file found for this product'
                });
            }
        } else {
            return res.status(404).json({
                status: 'ERR',
                message: 'Product not found'
            });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: 'ERR',
            message: 'Internal Server Error'
        });
    }
}


const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.deleteProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await ProductService.deleteManyProduct(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
      
        const response = await ProductService.getAllProduct(Number(limit) || null, Number(page) || 0, sort, filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllType = async (req, res) => {
    try {
        const response = await ProductService.getAllType()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    getDetailsProductPdf,
    deleteProduct,
    getAllProduct,
    deleteMany,
    getAllType
}
