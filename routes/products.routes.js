const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller'); // Asegúrate de que el controlador esté correcto

// Rutas de productos
router.get('/products', productsController.getProducts); // Obtener todos los productos
router.get('/products/:id', productsController.getProductById); // Obtener un producto por ID
router.post('/products', productsController.createProduct); // Crear un producto
router.put('/products/:id', productsController.updateProduct); // Actualizar un producto
router.delete('/products/:id', productsController.deleteProduct); // Eliminar un producto

// Ruta para iniciar sesión de usuario
router.post('/login', productsController.loginUsuario); // Login de usuario

// Ruta para obtener todos los usuarios
router.get('/usuarios', productsController.getUsuarios); // Obtener usuarios

module.exports = router;
