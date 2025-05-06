const Perro = require('../models/perro.model');

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
      const perroId = await Perro.create(req.body);
      res.status(201).json({ id: perroId, message: 'Perro creado exitosamente' });
    } catch (error) {
      console.error('Error al crear el perro:', error);
      res.status(500).json({ message: 'Error al crear el perro', error: error.message });
    }
  },

  // Actualizar un perro
  updatePerro: async (req, res) => {
    try {
      const updated = await Perro.update(req.params.id, req.body);
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
