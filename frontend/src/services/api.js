import { API_BASE_URL } from '../config';

export const submitPetition = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/campanafirmas`, {
      method: 'POST',
      body: formData, // Usamos el FormData directamente
      // No establecer 'Content-Type' manualmente cuando se envía FormData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al enviar la petición');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al enviar la petición:', error);
    throw error;
  }
};
