const { pool } = require('../config/database');

// Función para convertir Buffer a base64
const bufferToBase64 = (buffer) => {
  if (!buffer) return null;
  return `data:image/png;base64,${buffer.toString('base64')}`;
};

const Perro = {
  // Obtener todos los perros
  getAll: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM Perros');
      
      // Convertir el buffer de la imagen a base64
      return rows.map(perro => ({
        ...perro,
        FotografíaPrincipalPerro: bufferToBase64(perro.FotografíaPrincipalPerro)
      }));
    } catch (error) {
      console.error('Error al obtener los perros:', error);
      throw error;
    }
  },

  // Obtener un perro por ID
  getById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Perros WHERE IdPerro = ?', [id]);
      if (rows.length === 0) return null;
      
      // Convertir el buffer de la imagen a base64
      const perro = rows[0];
      return {
        ...perro,
        FotografíaPrincipalPerro: bufferToBase64(perro.FotografíaPrincipalPerro)
      };
    } catch (error) {
      console.error('Error al obtener el perro:', error);
      throw error;
    }
  },

  // Crear un nuevo perro
  create: async (perroData) => {
    try {
      const [result] = await pool.query('INSERT INTO Perros SET ?', [perroData]);
      return result.insertId;
    } catch (error) {
      console.error('Error al crear el perro:', error);
      throw error;
    }
  },

  // Actualizar un perro
  update: async (id, perroData) => {
    try {
      const [result] = await pool.query('UPDATE Perros SET ? WHERE IdPerro = ?', [perroData, id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error al actualizar el perro:', error);
      throw error;
    }
  },

  // Eliminar un perro (eliminación lógica)
  delete: async (id) => {
    try {
      const [result] = await pool.query('UPDATE Perros SET EstadoPerro = 0 WHERE IdPerro = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar el perro:', error);
      throw error;
    }
  }
};

module.exports = Perro;
