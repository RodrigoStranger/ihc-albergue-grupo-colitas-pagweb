import { client } from './client';

export const obtenerPerros = async () => {
  try {
    console.log('Iniciando consulta a Supabase...');
    const { data, error } = await client
      .from('perros')
      .select('*');

    if (error) {
      console.error('Error de Supabase:', error);
      throw new Error(`Error al obtener perros: ${error.message}`);
    }

    console.log('Datos obtenidos:', data);
    return data;
  } catch (error) {
    console.error('Error en la función obtenerPerros:', error);
    throw new Error(`Error general: ${error.message}`);
  }
};
