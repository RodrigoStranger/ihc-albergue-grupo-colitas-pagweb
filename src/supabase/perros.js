import { client } from './client';

export const obtenerPerros = async () => {
  try {
    const { data, error } = await client
      .from('Perros')
      .select('*');

    if (error) {
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

    return perrosConImagen;
  } catch (error) {
    throw new Error(`Error general: ${error.message}`);
  }
};