const express = require('express');
const cors = require('cors'); // Importa el paquete cors
const productsRoutes = require('./routes/products.routes');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
// Habilita CORS para todas las peticiones (cualquier origen)
app.use(cors());

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Rutas
app.use('/api', productsRoutes);

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
