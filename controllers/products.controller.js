const pool = require('../config/db');

// Obtener todos los productos
exports.getProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM productos');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// Obtener un producto por ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
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
    const { nombre, descripcion, precio_compra, precio_venta, stock, id_proveedor } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO productos (nombre, descripcion, precio_compra, precio_venta, stock, id_proveedor) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nombre, descripcion, precio_compra, precio_venta, stock, id_proveedor]
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
    const { nombre, descripcion, precio_compra, precio_venta, stock, id_proveedor } = req.body;
    try {
        const result = await pool.query(
            'UPDATE productos SET nombre = $1, descripcion = $2, precio_compra = $3, precio_venta = $4, stock = $5, id_proveedor = $6 WHERE id_producto = $7 RETURNING *',
            [nombre, descripcion, precio_compra, precio_venta, stock, id_proveedor, id]
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
        res.status(200).json({ message: 'Producto eliminado', producto: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};




exports.loginUsuario = async (req, res) => {
  const { correo, contrasena } = req.body;

  // Validación de entrada
  if (!correo || !contrasena) {
    return res.status(400).json({ message: 'Por favor, proporciona ambos campos' });
  }

  try {
    // Consulta SQL para obtener al usuario por correo
    const query = `
      SELECT id_usuario, nombre, correo, contrasena, rol
      FROM usuarios
      WHERE correo = $1
    `;

    const result = await pool.query(query, [correo]);

    // Verificar si el usuario existe
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'El usuario no existe o la contraseña es incorrecta' });
    }

    const usuario = result.rows[0];

    // Verificar la contraseña (en texto plano para este ejemplo)
    if (usuario.contrasena !== contrasena) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Respuesta exitosa
    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error('Error en el login:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
