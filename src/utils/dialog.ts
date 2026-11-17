/**
 * Helper dialog untuk Android/iOS.
 * Tetap memakai Alert.alert dengan argumen yang sama seperti sebelumnya.
 */

import { Alert } from 'react-native';

export function showMessage(title: string, message: string): void {
  Alert.alert(title, message);
}

export function confirmAction(
  title: string,
  message: string,
  confirmLabel: string
): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'Batal', style: 'cancel', onPress: () => resolve(false) },
        { text: confirmLabel, style: 'destructive', onPress: () => resolve(true) },
      ],
      { onDismiss: () => resolve(false) }
    );
  });
}
