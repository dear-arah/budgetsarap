// DeckScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

export default function deckscreen() {
  const [cards, setCards] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const addCard = () => {
    setCards([...cards, { question, answer }]);
    setQuestion('');
    setAnswer('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cards}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Q: {item.question}</Text>
            <Text>A: {item.answer}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Question"
        value={question}
        onChangeText={setQuestion}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Answer"
        value={answer}
        onChangeText={setAnswer}
      />
      <TouchableOpacity style={styles.button} onPress={addCard}>
        <Text>Add Card</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginVertical: 10 },
  button: { padding: 10, backgroundColor: '#ddd', borderRadius: 5, alignItems: 'center' },
  card: { padding: 10, backgroundColor: '#f0f0f0', marginVertical: 5 },
});
