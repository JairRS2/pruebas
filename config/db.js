const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});

// Probar la conexión al iniciar
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error al conectar a la base de datos:', err.message);
    } else {
        console.log('✅ Conexión exitosa a la base de datos PostgreSQL');
        release(); // Liberar el cliente una vez hecha la prueba
    }
});

pool.on('connect', () => {
    console.log('🔄 Nueva conexión establecida con PostgreSQL');
});

module.exports = pool;
