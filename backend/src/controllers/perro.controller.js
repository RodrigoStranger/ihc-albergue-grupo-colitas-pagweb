const Perro = require('../models/perro.model');

// Función para convertir base64 a Buffer
const base64ToBuffer = (base64String) => {
  if (!base64String) return null;
  // Remover el prefijo 'data:image/...;base64,' si existe
  const base64Data = base64String.includes('base64,') 
    ? base64String.split('base64,')[1] 
    : base64String;
  return Buffer.from(base64Data, 'base64');
};

const perroController = {
  // Obtener todos los perros
  getAllPerros: async (req, res) => {
    try {
      const perros = await Perro.getAll();
      res.json(perros);
    } catch (error) {
      console.error('Error al obtener los perros:', error);
      res.status(500).json({ message: 'Error al obtener los perros', error: error.message });
    }
  },

  // Obtener un perro por ID
  getPerroById: async (req, res) => {
    try {
      const perro = await Perro.getById(req.params.id);
      if (!perro) {
        return res.status(404).json({ message: 'Perro no encontrado' });
      }
      res.json(perro);
    } catch (error) {
      console.error('Error al obtener el perro:', error);
      res.status(500).json({ message: 'Error al obtener el perro', error: error.message });
    }
  },

  // Crear un nuevo perro
  createPerro: async (req, res) => {
    try {
      const perroData = { ...req.body };
      
      // Si se envía la imagen en base64, convertirla a Buffer
      if (perroData.FotografíaPrincipalPerro) {
        perroData.FotografíaPrincipalPerro = base64ToBuffer(perroData.FotografíaPrincipalPerro);
      }
      
      const perroId = await Perro.create(perroData);
      res.status(201).json({ id: perroId, message: 'Perro creado exitosamente' });
    } catch (error) {
      console.error('Error al crear el perro:', error);
      res.status(500).json({ message: 'Error al crear el perro', error: error.message });
    }
  },

  // Actualizar un perro
  updatePerro: async (req, res) => {
    try {
      const perroData = { ...req.body };
      
      // Si se envía la imagen en base64, convertirla a Buffer
      if (perroData.FotografíaPrincipalPerro) {
        perroData.FotografíaPrincipalPerro = base64ToBuffer(perroData.FotografíaPrincipalPerro);
      }
      
      const updated = await Perro.update(req.params.id, perroData);
      if (!updated) {
        return res.status(404).json({ message: 'Perro no encontrado' });
      }
      res.json({ message: 'Perro actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar el perro:', error);
      res.status(500).json({ message: 'Error al actualizar el perro', error: error.message });
    }
  },

  // Eliminar un perro (eliminación lógica)
  deletePerro: async (req, res) => {
    try {
      const deleted = await Perro.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: 'Perro no encontrado' });
      }
      res.json({ message: 'Perro eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar el perro:', error);
      res.status(500).json({ message: 'Error al eliminar el perro', error: error.message });
    }
  }
};

module.exports = perroController;
