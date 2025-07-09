import { client } from './client';

const CACHE_KEY = 'perros_adopcion_cache_v1';
const CACHE_TIME_MS = 20 * 60 * 1000; // 20 minutos

export const obtenerPerros = async () => {
  // 1. Intentar leer del caché
  try {
    const cacheRaw = localStorage.getItem(CACHE_KEY);
    if (cacheRaw) {
      const { data, timestamp } = JSON.parse(cacheRaw);
      if (data && timestamp && Date.now() - timestamp < CACHE_TIME_MS) {
        return data;
      }
    }
  } catch (e) {
    // Si hay error de parseo, ignorar y continuar
  }

  // 2. Si no hay caché válido, consultar a Supabase
  try {
    const { data, error } = await client
      .from('Perros')
      .select('*')
      .eq('EstadoPerro', 'Disponible');

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

    // 3. Guardar en caché
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: perrosConImagen,
        timestamp: Date.now()
      }));
    } catch (e) {
      // Si falla el caché, no afecta la carga
    }

    return perrosConImagen;
  } catch (error) {
    throw new Error(`Error general: ${error.message}`);
  }
};