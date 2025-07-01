import React, { useState } from 'react';
import { useLazyImage } from '../hooks/useLazyImage';

/**
 * Componente para carga optimizada de imágenes
 * @param {Object} props - Propiedades del componente
 * @param {string} props.src - URL de la imagen
 * @param {string} props.alt - Texto alternativo
 * @param {string} props.className - Clases CSS
 * @param {string} props.placeholder - Imagen de placeholder (opcional)
 * @param {boolean} props.lazy - Si usar lazy loading (por defecto true)
 * @param {Object} props.observerOptions - Opciones del Intersection Observer
 * @returns {JSX.Element} Componente de imagen optimizada
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  placeholder,
  lazy = true,
  observerOptions = {},
  onLoad,
  onError,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const { imgRef, isLoaded, shouldLoad } = useLazyImage(src, observerOptions);

  const handleLoad = (e) => {
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  // Si no es lazy loading, renderizar imagen normal
  if (!lazy) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    );
  }

  return (
    <div 
      ref={imgRef} 
      className={`optimized-image-container ${className}`}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Placeholder mientras carga */}
      {!isLoaded && !hasError && (
        <div 
          className="image-placeholder"
          style={{
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            minHeight: '200px'
          }}
        >
          {placeholder ? (
            <img src={placeholder} alt="" style={{ maxWidth: '50%', opacity: 0.5 }} />
          ) : (
            <div style={{ color: '#999', fontSize: '14px' }}>Cargando imagen...</div>
          )}
        </div>
      )}

      {/* Imagen principal */}
      {shouldLoad && !hasError && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease',
            opacity: isLoaded ? 1 : 0
          }}
          {...props}
        />
      )}

      {/* Mensaje de error */}
      {hasError && (
        <div 
          className="image-error"
          style={{
            backgroundColor: '#ffeeee',
            color: '#cc0000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            minHeight: '200px',
            fontSize: '14px'
          }}
        >
          Error al cargar imagen
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
