require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Configurar el cliente de Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const client = createClient(supabaseUrl, supabaseAnonKey);

// Importar la función obtenerPerros
const obtenerPerros = async () => {
  try {
    const { data, error } = await client
      .from('perros')
      .select('*');

    if (error) {
      console.error('Error al obtener perros:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error en la función obtenerPerros:', error);
    throw error;
  }
};

async function main() {
  try {
    const perros = await obtenerPerros();
    console.log('Datos de perros:', JSON.stringify(perros, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejecutar la función principal
main();
