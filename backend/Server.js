const express = require('express');
const cors = require('cors');
const { pool, testConnection } = require('./src/config/database');
const path = require('path');

// Importar rutas
const perrosRouter = require('./src/routes/perro.routes');
const campanaFirmaRouter = require('./src/routes/campanaFirma.routes');

// Crear la aplicación Express
const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:3000', // URL del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Aplicar CORS
app.use(cors(corsOptions));

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

// Middleware para registrar peticiones
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} [${duration}ms]`);
  });
  
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
      console.log(`Servidor en ejecución en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor');
    process.exit(1);
  }
};

// Iniciar la aplicación
startServer();