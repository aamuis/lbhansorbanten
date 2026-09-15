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
    maxWidth = 960,
    maxHeight = 960,
    quality = 0.82,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve) => {
    let src = '';
    let isObjectUrl = false;

    if (typeof fileOrDataUrl === 'string') {
      // If it's an SVG or already a relative asset path, don't re-compress
      if (
        fileOrDataUrl.startsWith('data:image/svg') || 
        fileOrDataUrl.startsWith('/images/') ||
        fileOrDataUrl.endsWith('.svg')
      ) {
        return resolve(fileOrDataUrl);
      }
      src = fileOrDataUrl;
    } else {
      // It's a File or Blob
      if (fileOrDataUrl.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(fileOrDataUrl);
        return;
      }
      try {
        src = URL.createObjectURL(fileOrDataUrl);
        isObjectUrl = true;
      } catch {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(fileOrDataUrl);
        return;
      }
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (isObjectUrl) {
        URL.revokeObjectURL(src);
      }

      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (!width || !height) {
        return resolve(src);
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
        return resolve(src);
      }

      // White background for transparent PNGs converted to JPEG
      if (mimeType === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);

      try {
        const result = canvas.toDataURL(mimeType, quality);
        resolve(result);
      } catch {
        resolve(src);
      }
    };

    img.onerror = () => {
      if (isObjectUrl) {
        URL.revokeObjectURL(src);
      }
      resolve(src);
    };

    img.src = src;
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
