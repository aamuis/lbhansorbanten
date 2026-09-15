/**
 * Image Compressor & Optimizer
 * Scales and compresses uploaded photos in-browser using HTML5 Canvas.
 * Solves LocalStorage 5MB quota exhaustion, Vercel payload limits, and slow uploads.
 */

export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

export async function compressImage(
  fileOrDataUrl: File | Blob | string,
  options: CompressImageOptions = {}
): Promise<string> {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.80,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve) => {
    // Helper to compress an image element once loaded
    const compressLoadedImage = (img: HTMLImageElement, fallbackDataUrl: string) => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          return resolve(fallbackDataUrl);
        }

        // Calculate new dimensions preserving aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return resolve(fallbackDataUrl);
        }

        // Fill white background for JPEGs
        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        const result = canvas.toDataURL(mimeType, quality);
        resolve(result);
      } catch (err) {
        console.warn('Canvas compression error, using fallback:', err);
        resolve(fallbackDataUrl);
      }
    };

    // If input is a string
    if (typeof fileOrDataUrl === 'string') {
      if (
        fileOrDataUrl.startsWith('data:image/svg') || 
        fileOrDataUrl.startsWith('/images/') ||
        fileOrDataUrl.endsWith('.svg') ||
        fileOrDataUrl.startsWith('http://') ||
        fileOrDataUrl.startsWith('https://')
      ) {
        return resolve(fileOrDataUrl);
      }

      // If it's a data URL string
      const img = new Image();
      img.onload = () => compressLoadedImage(img, fileOrDataUrl);
      img.onerror = () => resolve(fileOrDataUrl);
      img.src = fileOrDataUrl;
      return;
    }

    // If input is a File or Blob
    if (fileOrDataUrl.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(fileOrDataUrl);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const rawDataUrl = reader.result as string;
      if (!rawDataUrl) {
        return resolve('');
      }

      const img = new Image();
      img.onload = () => compressLoadedImage(img, rawDataUrl);
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(fileOrDataUrl);
  });
}

/**
 * Returns human-readable size of a base64 string or image in KB/MB
 */
export function getApproximateDataUrlSize(dataUrl: string): string {
  if (!dataUrl || !dataUrl.startsWith('data:')) return '';
  const stringLength = dataUrl.length - 'data:image/png;base64,'.length;
  const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
  const sizeInKb = Math.round(sizeInBytes / 1024);
  if (sizeInKb > 1024) {
    return `${(sizeInKb / 1024).toFixed(1)} MB`;
  }
  return `${sizeInKb} KB`;
}
