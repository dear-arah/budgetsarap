import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
function DeckScreen({ route }: { route: any }) {
  const { deckId } = route.params;
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [deckTitle, setDeckTitle] = useState('');
  const [email, setEmail] = useState('');

  const fetchUserEmail = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        alert('User email not found. Please log in again.');
      }
    } catch (err) {
      console.error('Failed to retrieve email:', err);
    }
  };

  const fetchDeck = async () => {
    if (!email) return; // Ensure the user email is available
    try {
      // Make an API call to fetch the deck data
      console.log('deckId:', deckId);
      const response = await axios.get(`http://192.168.1.9:3000/api/decks/${deckId}`, {
        params: { email }
      });
      
      console.log('Deck Title:', response.data.title); // Add this to verify what the response looks like
      console.log('Deck fetch response:', response.data); // Debug: Log the response data
  
      // Update the flashcards and deck title based on the response
      setFlashcards(response.data.flashcards || []);
      setDeckTitle(response.data.title || 'Untitled Deck'); // Update the deck title or set a default if missing
    } catch (err) {
      console.error('Error fetching deck:', err); // Log errors for debugging
      alert('Failed to fetch deck. Please try again.'); // Alert the user
    }
  };
  
  
  const addFlashcard = async () => {
    if (!question.trim() || !answer.trim()) {
      alert('Both question and answer are required');
      return;
    }
  
    try {
      const response = await axios.post(
        `http://192.168.1.9:3000/api/decks/add-flashcard`,
        { deckId, email, question, answer }
      );
      console.log('Add flashcard response:', response.data);
  
      if (response.data.status === 'ok') {
        setQuestion('');
        setAnswer('');
        fetchDeck(); // Refresh the deck after adding the flashcard
      } else {
        alert('Failed to add flashcard: ' + response.data.message);
      }
    } catch (err) {
      console.error('Error adding flashcard:', err);
      alert('An error occurred while adding the flashcard.');
    }
  };
  

  useEffect(() => {
    fetchUserEmail();
  }, []);

  useEffect(() => {
    if (email) {
      fetchDeck();
    }
  }, [email]);


  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.deckTitle}>{deckTitle || 'Deck Title'}</Text>
        <TextInput
          placeholder="Question"
          value={question}
          onChangeText={setQuestion}
          style={styles.textInput}
        />
        <TextInput
          placeholder="Answer"
          value={answer}
          onChangeText={setAnswer}
          style={styles.textInput}
        />
        <TouchableOpacity onPress={addFlashcard} style={styles.button}>
          <Text style={styles.buttonText}>Add Flashcard</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={flashcards}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Q: {item.question}</Text>
            <Text>A: {item.answer}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputContainer: { padding: 10 },
  textInput: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 5 },
  button: { backgroundColor: '#6200ea', padding: 10, alignItems: 'center', borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  deckTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, alignSelf: 'flex-start' },
  card: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
});

export default DeckScreen;
