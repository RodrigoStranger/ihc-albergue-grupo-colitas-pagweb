const express = require('express');
const { pool, testConnection } = require('./src/config/database');
const path = require('path');

// Importar rutas
const perrosRouter = require('./src/routes/perro.routes');
const campanaFirmaRouter = require('./src/routes/campanaFirma.routes');

// Crear la aplicación Express
const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de body-parser para JSON
app.use(express.json({ limit: '50mb' }));

// Configuración para datos de formulario
app.use(express.urlencoded({ 
  extended: false, // Cambiado a false para evitar problemas con formularios anidados
  limit: '50mb',
  parameterLimit: 1000000
}));

// Configurar middleware para archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware para loggear las peticiones
app.use((req, res, next) => {
  console.log(`\n=== Nueva petición [${new Date().toISOString()}] ===`);
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Content-Type:', req.get('Content-Type'));
  
  // Para peticiones POST, loggear el body
  if (req.method === 'POST') {
    console.log('Body:', req.body);
  }
  
  next();
});

// Ruta de prueba para verificar la conexión a la base de datos
app.get('/test-db', async (req, res) => {
  try {
    await testConnection();
    res.json({ success: true, message: 'Conexión a la base de datos exitosa' });
  } catch (error) {
    console.error('Error en la ruta de prueba:', error);
    res.status(500).json({ success: false, message: 'Error al conectar a la base de datos', error: error.message });
  }
});

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('API del Albergue Grupo Colitas está funcionando');
});

// Rutas de la API
app.use('/api/perros', perrosRouter);
app.use('/api', campanaFirmaRouter);

// Iniciar el servidor
const startServer = async () => {
  try {
    // Probar la conexión a la base de datos
    await testConnection();
    
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`Conectado a la base de datos: ${process.env.MYSQL_DATABASE}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar la aplicación
startServer();