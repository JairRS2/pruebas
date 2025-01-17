const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la primera conexión (Base de datos principal)
const poolMain = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE, // Base de datos principal
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});

// Configuración de la segunda conexión (MB_INSUMOS)
const poolInsumos = new Pool({
    host: process.env.PG_HOST, // Puedes usar un host diferente si aplica
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASEMB, // Nombre de la segunda base de datos
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});

// Probar ambas conexiones al iniciar
const testConnection = (pool, dbName) => {
    pool.connect((err, client, release) => {
        if (err) {
            console.error(`❌ Error al conectar a la base de datos ${dbName}:`, err.message);
        } else {
            console.log(`✅ Conexión exitosa a la base de datos ${dbName}`);
            release(); // Liberar el cliente una vez hecha la prueba
        }
    });
};

testConnection(poolMain, process.env.PG_DATABASE);
testConnection(poolInsumos,process.env.PG_DATABASEMB);

// Manejo de eventos para ambas bases de datos
poolMain.on('connect', () => {
    console.log('🔄 Nueva conexión establecida con PostgreSQL (Principal)');
});
poolInsumos.on('connect', () => {
    console.log('🔄 Nueva conexión establecida con PostgreSQL (MB_INSUMOS)');
});

// Exportar ambos pools
module.exports = {
    poolMain,
    poolInsumos,
};
