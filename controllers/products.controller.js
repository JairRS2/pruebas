// products.controller.js

const pool = require('../db'); // Conexión a la base de datos
const { sql } = require('pg'); // Si usas PostgreSQL, ajusta esto

// Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM producto'); // Cambia 'producto' por el nombre de tu tabla
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Obtener producto por ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM producto WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
  const { nombre, precio, descripcion } = req.body; // Ajusta los campos según tu tabla
  try {
    const result = await pool.query(
      'INSERT INTO producto (nombre, precio, descripcion) VALUES ($1, $2, $3) RETURNING *',
      [nombre, precio, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, descripcion } = req.body;
  try {
    const result = await pool.query(
      'UPDATE producto SET nombre = $1, precio = $2, descripcion = $3 WHERE id = $4 RETURNING *',
      [nombre, precio, descripcion, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM producto WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};

// Login de usuario
exports.loginUsuario = async (req, res) => {
  const { cClaveEmpleado, cClaveUsuario } = req.body;
  
  // Validación de entrada
  if (!cClaveEmpleado || !cClaveUsuario) {
    return res.status(400).json({ message: 'Por favor, proporciona ambos campos' });
  }

  try {
    // Consulta SQL para obtener el usuario
    const query = `
      SELECT cClaveEmpleado, cClaveUsuario, nNivelUsuario, cNombreEmpleado
      FROM usuario
      WHERE cClaveEmpleado = $1
    `;
    
    const result = await pool.query(query, [cClaveEmpleado]);

    // Verificar si el usuario existe
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'El usuario o la contraseña son incorrectos' });
    }

    const usuario = result.rows[0];

    // Verificar la contraseña
    if (usuario.cClaveUsuario !== cClaveUsuario) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Mapeo de roles basado en el nivel de usuario
    const roles = {
      5: 'Administrador',
      1: 'Usuario',
      0: 'Usuario'
    };

    const role = roles[usuario.nNivelUsuario] || 'Rol no autorizado';

    // Si el rol no es válido
    if (role === 'Rol no autorizado') {
      return res.status(403).json({ message: 'Rol no autorizado' });
    }

    // Respuesta exitosa
    return res.status(200).json({
      message: `Inicio de sesión exitoso: ${usuario.cNombreEmpleado}`,
      nombre: usuario.cNombreEmpleado,
      nNivelUsuario: usuario.nNivelUsuario,
      role: role,
    });
  } catch (error) {
    console.error('Error en el login:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener usuarios
exports.getUsuarios = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuario'); // Asegúrate de usar el nombre correcto de la tabla
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};
