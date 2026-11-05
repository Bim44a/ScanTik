/**
 * Typography tokens dari design-report.md Bagian 2
 * Font: Poppins (identitas/judul), Open Sans (isi/kontrol)
 */

export const Typography = {
  // Wordmark "ScanTik"
  wordmark: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 36,
    lineHeight: 45,
    letterSpacing: -1.3,
  },
  
  // Judul layar "Katalog Motif"
  screenTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 28,
    lineHeight: 40,
    letterSpacing: -0.6,
  },
  
  // Judul kartu "Motif Jlamprang"
  cardTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 15,
    lineHeight: 23,
    letterSpacing: 0,
  },
  
  // Isi kartu "Geometri pesisir dengan..."
  cardBody: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0,
  },
  
  // Sapaan "Selamat datang,"
  greeting: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 13,
    lineHeight: undefined, // Auto
    letterSpacing: 0,
  },
  
  // Label tombol "Pilih dari Galeri"
  buttonLabel: {
    fontFamily: 'OpenSans_600SemiBold',
    fontSize: 15,
    lineHeight: undefined, // Auto
    letterSpacing: 0,
  },
  
  // Label tab "Scanner" (aktif)
  tabLabelActive: {
    fontFamily: 'OpenSans_700Bold',
    fontSize: 11,
    lineHeight: undefined, // Auto
    letterSpacing: 0,
  },
  
  // Label tab "Scanner" (nonaktif)
  tabLabelInactive: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 11,
    lineHeight: undefined, // Auto
    letterSpacing: 0,
  },
  
  // Lencana "Kecocokan 94%"
  badge: {
    fontFamily: 'OpenSans_600SemiBold',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0,
  },
  
  // Instruksi unggah
  uploadInstruction: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 15,
    lineHeight: 24.75, // 165% dari 15px
    letterSpacing: 0,
  },
  
  // Metadata "JPG / PNG", "Maks. 10 MB"
  metadata: {
    fontFamily: 'OpenSans_400Regular',
    fontSize: 11,
    lineHeight: undefined, // Auto
    letterSpacing: 0,
  },
};
