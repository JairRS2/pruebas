const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');

// Rutas de productos
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);
router.post('/', productsController.createProduct);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
