import { useState, useEffect, useRef } from 'react';

/**
 * Hook personalizado para lazy loading de imágenes
 * @param {string} src - URL de la imagen
 * @param {Object} options - Opciones del Intersection Observer
 * @returns {Object} - Estado de carga y ref del elemento
 */
export const useLazyImage = (src, options = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Cargar la imagen 50px antes de que sea visible
        threshold: 0.1,
        ...options
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [options]);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.onload = () => {
        setIsLoaded(true);
      };
      img.src = src;
    }
  }, [isInView, src]);

  return {
    imgRef,
    isLoaded,
    isInView,
    shouldLoad: isInView
  };
};

/**
 * Hook para precargar múltiples imágenes
 * @param {Array} imageSources - Array de URLs de imágenes
 * @returns {Object} - Estado de carga de todas las imágenes
 */
export const useImagePreloader = (imageSources = []) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (imageSources.length === 0) {
      setIsLoading(false);
      return;
    }

    let loadedCount = 0;
    const totalImages = imageSources.length;

    const preloadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(src));
          loadedCount++;
          if (loadedCount === totalImages) {
            setIsLoading(false);
          }
          resolve(src);
        };
        img.onerror = reject;
        img.src = src;
      });
    };

    // Precargar todas las imágenes
    Promise.allSettled(imageSources.map(preloadImage));

  }, [imageSources]);

  return {
    loadedImages,
    isLoading,
    isImageLoaded: (src) => loadedImages.has(src)
  };
};
