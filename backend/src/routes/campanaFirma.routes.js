const express = require('express');
const router = express.Router();
const multer = require('multer');
const campanaFirmaController = require('../controllers/campanaFirma.controller');

// Configuración de multer con memoryStorage
const storage = multer.memoryStorage();

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB
    files: 1,
    fields: 3 // Número de campos de texto que esperamos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, etc.)'), false);
    }
  }
});

// Middleware para manejar la subida del archivo
const handleFileUpload = (req, res, next) => {
  // Configurar multer para manejar el formulario
  const uploadSingle = upload.single('ImagenFirma');
  
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('Error en multer:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Error al procesar el archivo',
        error: {
          name: err.name,
          message: err.message,
          code: err.code,
          field: err.field
        }
      });
    }
    
    // Verificar que se haya recibido el archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha proporcionado ningún archivo de imagen',
        receivedFields: Object.keys(req.body)
      });
    }
    
    next();
  });
};

// Ruta para crear una nueva campaña de firmas
router.post('/campanafirmas', handleFileUpload, campanaFirmaController.createCampanaFirma);

module.exports = router;
