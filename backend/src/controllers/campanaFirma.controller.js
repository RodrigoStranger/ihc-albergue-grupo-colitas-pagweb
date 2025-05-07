const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const campanaFirmaModel = require('../models/campanaFirma.model');

// Configuración de directorios
const UPLOAD_DIR = 'C:\\ProgramData\\MySQL\\MySQL Server 8.4\\Uploads\\GrupoColitasPerros';

// Crear directorio si no existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const campanaFirmaController = {
  // Crear una nueva campaña de firmas
  createCampanaFirma: async (req, res) => {
    try {
      // Verificar que se haya enviado un archivo
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se ha proporcionado ninguna imagen'
        });
      }

      // Extraer datos del formulario
      const { DniFirma, NombreFirma, MotivoFirma } = req.body;
      
      // Validar campos requeridos
      const camposFaltantes = [];
      if (!DniFirma) camposFaltantes.push('DniFirma');
      if (!NombreFirma) camposFaltantes.push('NombreFirma');
      if (!MotivoFirma) camposFaltantes.push('MotivoFirma');

      if (camposFaltantes.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Faltan campos obligatorios: ${camposFaltantes.join(', ')}`,
          camposFaltantes,
          receivedFields: Object.keys(req.body)
        });
      }

      // Validar formato de DNI (8 dígitos)
      if (!/^\d{8}$/.test(DniFirma)) {
        return res.status(400).json({
          success: false,
          message: 'El DNI debe contener exactamente 8 dígitos',
          receivedDni: DniFirma
        });
      }

      // Validar formato de DNI (exactamente 8 caracteres numéricos)
      if (typeof DniFirma !== 'string' || DniFirma.length !== 8 || !/^\d+$/.test(DniFirma)) {
        return res.status(400).json({ 
          success: false, 
          message: 'El DNI debe contener exactamente 8 dígitos numéricos' 
        });
      }

      // Verificar si ya existe una firma con este DNI
      try {
        const firmaExistente = await campanaFirmaModel.getByDni(DniFirma);
        if (firmaExistente) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe una firma con este DNI',
            dni: DniFirma
          });
        }
      } catch (error) {
        console.error('Error al verificar DNI existente:', error);
        return res.status(500).json({
          success: false,
          message: 'Error al verificar el DNI'
        });
      }

      // Procesar la imagen
      const fileName = `fotoFirma${DniFirma}.png`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      try {
        // Usar sharp para procesar la imagen en memoria
        await sharp(req.file.buffer)
          .toFormat('png')
          .toFile(filePath);
      } catch (error) {
        console.error('Error al procesar la imagen:', error);
        return res.status(500).json({
          success: false,
          message: 'Error al procesar la imagen'
        });
      }

      try {
        // Crear la campaña usando el modelo
        const nuevaFirma = await campanaFirmaModel.create({
          DniFirma,
          NombreFirma,
          MotivoFirma,
          ImagenFirma: fileName
        });

        res.status(201).json({
          success: true,
          message: 'Firma registrada exitosamente',
          data: nuevaFirma
        });
      } catch (error) {
        console.error('Error al crear la firma:', error);
        
        // Intentar eliminar la imagen si se subió pero falló la creación en la base de datos
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (fsError) {
          console.error('Error al limpiar la imagen:', fsError);
        }

        res.status(500).json({
          success: false,
          message: 'Error al registrar la firma en la base de datos'
        });
      }

    } catch (error) {
      console.error('Error al crear campaña de firmas:', error);
      
      // Limpiar el archivo subido si hubo un error
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error al limpiar archivo temporal:', unlinkError);
        }
      }
      
      // Manejar errores de duplicado de DNI
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una campaña con este DNI'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al procesar la solicitud',
        error: error.message
      });
    }
  },
};

module.exports = campanaFirmaController;
