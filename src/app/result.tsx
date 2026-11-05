import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Colors } from '@/theme/colors';

export default function ResultScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Hasil Pindaian' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Hasil</Text>
        <Text style={styles.placeholder}>Placeholder Screen</Text>
      </View>
    </>
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
