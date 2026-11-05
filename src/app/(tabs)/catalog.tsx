import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';

export default function CatalogScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Katalog</Text>
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
    fontSize: 24,
    color: Colors.text,
    fontWeight: 'bold',
    // TODO: Use design tokens for typography
  },
  placeholder: {
    color: Colors.textSecondary,
    marginTop: 8,
  },
});
