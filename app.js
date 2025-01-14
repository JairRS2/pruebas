const express = require('express');
const productsRoutes = require('./routes/products.routes');

const app = express();
app.use(express.json());
//
// Rutas
app.use('/api/products', productsRoutes);

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
