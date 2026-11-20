import { ImageSourcePropType } from 'react-native';

export interface MotifPhoto {
  source: ImageSourcePropType;
  credit: string;
}

/** Kredit foto untuk seluruh motif. Ubah di satu tempat ini. */
const PHOTO_CREDIT = 'Dokumentasi pribadi';

/**
 * Peta slug motif -> foto asli beserta kreditnya.
 * Slug mengikuti MOTIF_META di src/data/motifMeta.ts.
 */
export const MOTIF_PHOTOS: Record<string, MotifPhoto> = {
  buketan: {
    source: require('../../assets/images/motifs/buketan.jpg'),
    credit: PHOTO_CREDIT,
  },
  jlamprang: {
    source: require('../../assets/images/motifs/jlamprang.jpg'),
    credit: PHOTO_CREDIT,
  },
  liong: {
    source: require('../../assets/images/motifs/liong.jpg'),
    credit: PHOTO_CREDIT,
  },
  'mega-mendung': {
    source: require('../../assets/images/motifs/mega-mendung.jpg'),
    credit: PHOTO_CREDIT,
  },
  'singa-barong': {
    source: require('../../assets/images/motifs/singa-barong.jpg'),
    credit: PHOTO_CREDIT,
  },
  'tujuh-rupa': {
    source: require('../../assets/images/motifs/tujuh-rupa.jpg'),
    credit: PHOTO_CREDIT,
  },
};

/** Ambil foto motif berdasarkan slug; undefined bila tidak tersedia. */
export function getMotifPhoto(slug?: string): MotifPhoto | undefined {
  if (!slug) return undefined;
  return MOTIF_PHOTOS[slug];
}
