import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

/**
 * Memperkecil gambar ke maksimal 1024px sisi terpanjang, output JPEG 0.7 quality.
 * @param uri URI gambar asli
 * @returns URI gambar yang sudah dikompres
 */
export async function prepareImage(uri: string): Promise<string> {
  const context = ImageManipulator.manipulate(uri, {
    maxWidth: 1024,
    maxHeight: 1024,
  });

  context.resize({ width: 1024, height: null });

  const imageRef = await context.renderAsync();
  const result = await imageRef.saveAsync({
    format: SaveFormat.JPEG,
    compress: 0.7,
  });

  return result.uri;
}
