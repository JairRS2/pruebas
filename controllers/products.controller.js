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




// Login de usuarios con roles
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
        WHERE cClaveEmpleado = @cClaveEmpleado
      `;
  
      const result = await pool
        .request()
        .input('cClaveEmpleado', sql.VarChar, cClaveEmpleado)
        .query(query);
  
      // Verificar si el usuario existe
      if (result.recordset.length === 0) {
        return res.status(401).json({ message: 'El usuario o la contraseña son incorrectos' });
      }
  
      const usuario = result.recordset[0];
  
      // Verificar la contraseña en texto plano
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