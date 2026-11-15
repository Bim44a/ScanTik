import { Motif, MOTIFS } from './motifs';
import { AppIconName } from '@/components/AppIcon';

export interface MotifMeta {
  slug: string;
  icon: AppIconName;
}

export const MOTIF_META: Record<string, MotifMeta> = {
  'Buketan': { slug: 'buketan', icon: 'leaf-outline' },
  'Jlamprang': { slug: 'jlamprang', icon: 'flower-outline' },
  'Liong': { slug: 'liong', icon: 'flame-outline' },
  'Mega Mendung': { slug: 'mega-mendung', icon: 'cloud-outline' },
  'Singa Barong': { slug: 'singa-barong', icon: 'paw-outline' },
  'Tujuh Rupa': { slug: 'tujuh-rupa', icon: 'color-palette-outline' },
};

/**
 * Mengambil data motif berdasarkan slug.
 */
export function getMotifBySlug(slug: string): Motif | undefined {
  const className = Object.keys(MOTIF_META).find(
    (key) => MOTIF_META[key].slug === slug
  );
  if (!className) return undefined;
  return MOTIFS.find((m) => m.class === className);
}

/**
 * Mengambil nama daerah saja (sebelum tanda kurung).
 * Contoh: "Pekalongan (Krapyak)" -> "Pekalongan"
 */
export function getRegion(origin: string): string {
  return origin.split('(')[0].trim();
}

/**
 * Mengambil slug motif berdasarkan kelas.
 * Mengembalikan undefined untuk kelas yang tidak dipetakan (termasuk "Negatif").
 */
export function getSlugByClass(className: string): string | undefined {
  return MOTIF_META[className]?.slug;
}
