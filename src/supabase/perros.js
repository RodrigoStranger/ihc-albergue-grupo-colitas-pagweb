import { client } from './client';

export const obtenerPerros = async () => {
  try {
    console.log('Iniciando consulta a Supabase...');
    const { data, error } = await client
      .from('Perros')
      .select('*');

    if (error) {
      console.error('Error de Supabase:', error);
      throw new Error(`Error al obtener perros: ${error.message}`);
    }

    // Obtener la URL base del bucket de Supabase
    const { data: { publicUrl } } = client.storage
      .from('perros') // Nombre del bucket
      .getPublicUrl('');

    // Mapear los datos para incluir la URL completa de la imagen
    const perrosConImagen = data.map(perro => ({
      ...perro,
      FotoPerro: perro.FotoPerro ? 
        `${publicUrl.split('/').slice(0, -1).join('/')}/${perro.FotoPerro}` : 
        null
    }));

    console.log('Datos obtenidos:', perrosConImagen);
    return perrosConImagen;
  } catch (error) {
    console.error('Error en la función obtenerPerros:', error);
    throw new Error(`Error general: ${error.message}`);
  }
};
