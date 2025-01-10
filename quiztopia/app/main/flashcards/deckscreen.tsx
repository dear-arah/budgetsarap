import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

function DeckScreen({ route }: { route: any }) {
  const { deckId } = route.params;
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const fetchDeck = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`http://192.168.1.9:3000/api/decks/${deckId}`, {
        headers: { 'x-access-token': token },
      });
      setFlashcards(response.data.flashcards);
    } catch (err) {
      console.error(err);
    }
  };

  const addFlashcard = async () => {
    if (!question || !answer) {
      alert('Both question and answer are required');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `http://192.168.1.9:3000/api/decks/add-flashcard`,
        { deckId, question, answer },
        { headers: { 'x-access-token': token } }
      );

      if (response.data.status === 'ok') {
        setQuestion('');
        setAnswer('');
        fetchDeck();
      } else {
        alert(response.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeck();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={flashcards}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Q: {item.question}</Text>
            <Text>A: {item.answer}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput placeholder="Question" value={question} onChangeText={setQuestion} />
        <TextInput placeholder="Answer" value={answer} onChangeText={setAnswer} />
        <TouchableOpacity onPress={addFlashcard}>
          <Text>Add Flashcard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  inputContainer: { padding: 10 },
});

export default DeckScreen;
