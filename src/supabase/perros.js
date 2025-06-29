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

    // Mapear los datos para incluir la URL pública correcta de la imagen
    const perrosConImagen = data.map(perro => {
      if (perro.FotoPerro) {
        // Extraer el nombre del archivo de la URL firmada
        let nombreArchivo = perro.FotoPerro;
        
        // Si la URL contiene el path completo de Supabase, extraer solo el nombre del archivo
        if (perro.FotoPerro.includes('supabase.co/storage/v1/object/sign/perros/')) {
          const urlParts = perro.FotoPerro.split('/');
          const fileNameWithToken = urlParts[urlParts.length - 1];
          // Remover el token (todo lo que viene después del ?)
          nombreArchivo = fileNameWithToken.split('?')[0];
        }
        
        // Obtener la URL pública del archivo específico
        const { data: { publicUrl } } = client.storage
          .from('perros')
          .getPublicUrl(nombreArchivo);
        
        return {
          ...perro,
          FotoPerro: publicUrl
        };
      }
      
      return {
        ...perro,
        FotoPerro: null
      };
    });

    console.log('Datos obtenidos:', perrosConImagen);
    return perrosConImagen;
  } catch (error) {
    console.error('Error en la función obtenerPerros:', error);
    throw new Error(`Error general: ${error.message}`);
  }
};

// Función auxiliar para extraer el nombre del archivo de diferentes formatos de URL
const extraerNombreArchivo = (url) => {
  // Si es una URL firmada de Supabase
  if (url.includes('supabase.co/storage/v1/object/sign/')) {
    const pathAfterBucket = url.split('/perros/')[1];
    return pathAfterBucket ? pathAfterBucket.split('?')[0] : url;
  }
  
  // Si es una URL pública de Supabase
  if (url.includes('supabase.co/storage/v1/object/public/')) {
    const pathAfterBucket = url.split('/perros/')[1];
    return pathAfterBucket || url;
  }
  
  // Si es solo el nombre del archivo
  return url;
};