const express = require('express');
const { pool, testConnection } = require('./src/config/database');

// Crear la aplicación Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para parsear JSON
app.use(express.json());

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