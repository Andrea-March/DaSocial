import imageCompression from "browser-image-compression";

// Carica dalle env con fallback
const MAX_MB = import.meta.env.VITE_IMAGE_COMPRESSION_MAX_MB
  ? Number(import.meta.env.VITE_IMAGE_COMPRESSION_MAX_MB)
  : 0.5;

const MAX_RES = import.meta.env.VITE_IMAGE_MAX_RESOLUTION
  ? Number(import.meta.env.VITE_IMAGE_MAX_RESOLUTION)
  : 1280;

// Funzione riutilizzabile
export async function compressImage(file) {
  if (!file) return null;

  const options = {
    maxSizeMB: MAX_MB,
    maxWidthOrHeight: MAX_RES,
    fileType: "image/webp",
    useWebWorker: true
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (err) {
    console.error("Image compression error:", err);
    // fallback → restituisci l’immagine originale
    return file;
  }
}
