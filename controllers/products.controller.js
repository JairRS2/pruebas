const pool = require('../config/db');
const { sql } = require('pg'); // Si usas PostgreSQL, ajusta esto
const bcrypt = require("bcrypt");

// Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos'); // Cambié 'productos' por 'producto'
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
};

// Obtener producto por ID
exports.getProductById = async (req, res) => {
  const {id} = req.params;
  try {
    const result = await pool.query('SELECT * FROM productos WHERE id_producto = $1', [id]);
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
  const {
    nombre,
    descripcion,
    precio_compra,
    precio_venta,
    stock,
    id_proveedor,
    fecha_registro
  } = req.body; // Ajustamos los campos según tu tabla
  try {
    const result = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio_compra, precio_venta, stock, id_proveedor, fecha_registro) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nombre, descripcion, precio_compra, precio_venta, stock, id_proveedor, fecha_registro]
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
  const {
    nombre,
    descripcion,
    precio_compra,
    precio_venta,
    stock,
    id_proveedor,
    fecha_registro
  } = req.body; // Ajustamos los campos según tu tabla
  try {
    const result = await pool.query(
      'UPDATE productos SET nombre = $1, descripcion = $2, precio_compra = $3, precio_venta = $4, stock = $5, id_proveedor = $6, fecha_registro = $7 WHERE id_producto = $8 RETURNING *',
      [nombre, descripcion, precio_compra, precio_venta, stock, id_proveedor, fecha_registro, id]
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
    const result = await pool.query('DELETE FROM productos WHERE id_producto = $1 RETURNING *', [id]);
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
  const { correo, contrasena } = req.body;

  try {
    // Validación de entrada
    if (!correo || !contrasena) {
      return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    // Verificar si el usuario existe en la base de datos
    const query = "SELECT * FROM usuarios WHERE correo = $1";
    const result = await pool.query(query, [correo]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = result.rows[0];

    // Comparar la contraseña ingresada con la almacenada (debe estar encriptada con bcrypt)
    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!esValida) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // Aquí puedes generar un token JWT si lo necesitas para autenticación
    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error del servidor" });
  }
}


// Obtener usuarios
exports.getUsuarios = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios'); // Asegúrate de usar el nombre correcto de la tabla
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};