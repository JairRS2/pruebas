const pool = require('../config/db');
const { sql } = require('pg'); // Si usas PostgreSQL, ajusta esto

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
  const {id_producto} = req.params;
  try {
    const result = await pool.query('SELECT * FROM productos WHERE id_producto = $1', [id_producto]);
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
  const { id_producto } = req.params;
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
      [nombre, descripcion, precio_compra, precio_venta, stock, id_proveedor, fecha_registro, id_producto]
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
    const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);
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
    const { cclaveempleado, cclaveusuario } = req.body;
  
    // Validación de entrada
    if (!cclaveempleado || !cclaveusuario) {
      return res.status(400).json({ message: 'Por favor, proporciona ambos campos' });
    }
  
    try {
      // Consulta SQL para obtener el usuario
      const query = `
        SELECT cclaveempleado, cclaveusuario, nnivelusuario, cnombreempleado
        FROM usuario
        WHERE cclaveempleado = $1
      `;
  
      const result = await pool.query(query, [cclaveempleado]);
  
      // Verificar si el usuario existe
      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'El usuario o la contraseña son incorrectos' });
      }
  
      // Acceder al usuario desde los resultados
      const usuario = result.rows[0];
  
      // Mostrar los datos del usuario en la consola (opcional, para debug)
      console.log('Usuario encontrado:', usuario);
  
      // Verificar la contraseña
      if (usuario.cclaveusuario !== cclaveusuario) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
  
      // Mapeo de roles basado en el nivel de usuario
      const roles = {
        5: 'Administrador',
        1: 'Usuario',
        0: 'Usuario',
      };
  
      const role = roles[usuario.nnivelusuario] || 'Rol no autorizado';
  
      // Si el rol no es válido
      if (role === 'Rol no autorizado') {
        return res.status(403).json({ message: 'Rol no autorizado' });
      }
  
      // Respuesta exitosa
      return res.status(200).json({
        message: `Inicio de sesión exitoso: ${usuario.cnombreempleado}`,
        nombre: usuario.cnombreempleado,
        nnivelusuario: usuario.nnivelusuario,
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