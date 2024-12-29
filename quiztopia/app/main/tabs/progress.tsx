import { View, Text, StyleSheet } from 'react-native';


export default function ProgressPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress</Text>
      <Text>Summary of Decks</Text>
      <Text>History Table</Text>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5', // Light background color
      },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});
