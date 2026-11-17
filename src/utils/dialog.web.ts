/**
 * Helper dialog untuk web.
 * Alert.alert dari react-native-web tidak melakukan apa pun, jadi pesan dan
 * konfirmasi memakai dialog bawaan browser.
 */

export function showMessage(title: string, message: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.alert(message ? `${title}\n\n${message}` : title);
}

export function confirmAction(
  title: string,
  message: string,
  confirmLabel: string
): Promise<boolean> {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }
  const text = message ? `${title}\n\n${message}` : title;
  const confirmed = window.confirm(`${text}\n\nTekan OK untuk ${confirmLabel}.`);
  return Promise.resolve(confirmed);
}
