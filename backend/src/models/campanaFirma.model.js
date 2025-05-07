const { pool } = require('../config/database');

const campanaFirmaModel = {
  // Crear una nueva campaña de firmas
  create: async (campañaData) => {
    const { DniFirma, NombreFirma, MotivoFirma, ImagenFirma } = campañaData;
    
    const [result] = await pool.query(
      'INSERT INTO CampañaFirmas (DniFirma, NombreFirma, MotivoFirma, ImagenFirma) VALUES (?, ?, ?, ?)',
      [DniFirma, NombreFirma, MotivoFirma, ImagenFirma]
    );
    
    return {
      IdFirma: result.insertId,
      DniFirma,
      NombreFirma,
      MotivoFirma,
      ImagenFirma
    };
  },

  // Obtener campaña por DNI
  getByDni: async (dni) => {
    const [rows] = await pool.query(
      'SELECT * FROM CampañaFirmas WHERE DniFirma = ?',
      [dni]
    );
    return rows[0];
  },

  // Obtener todas las campañas
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM CampañaFirmas');
    return rows;
  },

  // Obtener una campaña por DNI
  getCampanaFirmaByDni: async (dni) => {
    try {
      const [rows] = await pool.query('SELECT * FROM CampañaFirmas WHERE DniFirma = ?', [dni]);
      return rows[0];
    } catch (error) {
      console.error('Error en getCampanaFirmaByDni:', error);
      throw error;
    }
  },

  // Actualizar una campaña
  update: async (id, campañaData) => {
    const { NombreFirma, MotivoFirma, ImagenFirma } = campañaData;
    
    await pool.query(
      'UPDATE CampañaFirmas SET NombreFirma = ?, MotivoFirma = ?, ImagenFirma = ? WHERE IdFirma = ?',
      [NombreFirma, MotivoFirma, ImagenFirma, id]
    );
    
    return { IdFirma: id, ...campañaData };
  },

  // Eliminar una campaña
  delete: async (id) => {
    await pool.query('DELETE FROM CampañaFirmas WHERE IdFirma = ?', [id]);
    return true;
  }
};

module.exports = campanaFirmaModel;
