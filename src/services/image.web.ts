/**
 * Kompresi gambar untuk web memakai Canvas browser.
 *
 * expo-image-manipulator web tidak dipakai karena `resize({ height: null })`
 * pada implementasi web SDK 58 menghasilkan tinggi 0 dan memicu
 * IndexSizeError. Dekode dan penskalaan dilakukan sendiri di sini.
 */

const MAX_LONGEST_SIDE = 1024;
const JPEG_QUALITY = 0.7;

type DecodedImage = HTMLImageElement | ImageBitmap;

function loadWithImageElement(uri: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (!image.naturalWidth || !image.naturalHeight) {
        reject(new Error('Gambar tidak memiliki ukuran yang valid.'));
        return;
      }
      resolve(image);
    };
    image.onerror = () => reject(new Error('Gambar tidak dapat dimuat.'));
    image.src = uri;
  });
}

async function decodeImage(uri: string): Promise<DecodedImage> {
  if (typeof createImageBitmap === 'function') {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('Gambar tidak dapat dibaca.');
      }
      const blob = await response.blob();
      return await createImageBitmap(blob, { imageOrientation: 'from-image' });
    } catch (error) {
      console.warn('createImageBitmap gagal, memakai HTMLImageElement:', error);
    }
  }

  return loadWithImageElement(uri);
}

function getImageSize(source: DecodedImage): { width: number; height: number } {
  const image = source as HTMLImageElement & ImageBitmap;
  return {
    width: image.naturalWidth || image.width,
    height: image.naturalHeight || image.height,
  };
}

/**
 * Memperkecil gambar ke maksimal 1024px sisi terpanjang, output JPEG 0.7.
 * Mengembalikan object URL dari Blob JPEG. Blob tersebut dapat diambil lagi
 * oleh predict.web.ts melalui fetch(uri).
 */
export async function prepareImage(uri: string): Promise<string> {
  const source = await decodeImage(uri);
  const { width, height } = getImageSize(source);

  if (!width || !height) {
    throw new Error('Gambar tidak memiliki ukuran yang valid.');
  }

  const scale = Math.min(1, MAX_LONGEST_SIDE / Math.max(width, height));
  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D tidak tersedia di browser.');
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(source, 0, 0, targetWidth, targetHeight);

  if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) {
    source.close();
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Gagal mengompres gambar.'));
        }
      },
      'image/jpeg',
      JPEG_QUALITY
    );
  });

  canvas.width = 0;
  canvas.height = 0;

  return URL.createObjectURL(blob);
}
