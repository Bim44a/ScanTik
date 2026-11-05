import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat</Text>
      <Text style={styles.placeholder}>Placeholder Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.screenTitle,
    color: Colors.textPrimary,
  },
  placeholder: {
    color: Colors.textSecondary,
    marginTop: 8,
  },
});
