import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Add this import for navigation

function DeckScreen({ route }) {
  const { deckId } = route.params;
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [deckTitle, setDeckTitle] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation(); // Get navigation object


  const navigateToFlashcardPage = () => {
    navigation.navigate('FlashcardPage', { deckId }); // Pass deckId to FlashcardPage
  };

  // Fetch user email from AsyncStorage
  useEffect(() => {
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
  
    fetchUserEmail();
  }, []);

  // Fetch deck once email is retrieved
  useEffect(() => {
    const fetchDeck = async () => {
      if (!email) return;
  
      console.log('Fetching deck with ID:', deckId, 'and email:', email); // Debug log
      try {
        const response = await axios.get(`http://192.168.1.6:3000/api/decks/${deckId}`, {
          params: { email },
        });
        console.log('Deck response:', response.data); // Log API response
  
        setFlashcards(response.data.data.flashcards || []);
        setDeckTitle(response.data.data.title || 'Untitled Deck');
      } catch (err) {
        console.error('Error fetching deck:', err.response?.data || err.message);
      }

    };
  
    fetchDeck();
  }, [email]); // Fetch deck when email is updated
  


  // Function to handle adding a flashcard
  const addFlashcard = async () => {
    if (!question || !answer) {
      alert('Please enter both a question and an answer.');
      return;
    }

    try {
      const response = await axios.post(
        'http://192.168.1.6:3000/api/decks/add-flashcard',
        { deckId, question, answer, email }
      );

      // Update the flashcards state with the newly added flashcard
      setFlashcards(response.data.data.flashcards);
      setQuestion('');
      setAnswer('');
    } catch (err) {
      console.error('Error adding flashcard:', err.response?.data || err.message);
      alert('Failed to add flashcard. Please try again.');
    }
  };

  const updateFlashcard = async (flashcardId, updatedQuestion, updatedAnswer) => {
    try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const response = await axios.put(
            `http://192.168.1.6:3000/decks/${deckId}/flashcards/${flashcardId}`,
            { question: updatedQuestion, answer: updatedAnswer },
            { headers: { Authorization: `Bearer ${storedEmail}` } } // If using JWT
        );
        console.log('Flashcard updated:', response.data.flashcard);
    } catch (error) {
        console.error('Error updating flashcard:', error.response?.data || error.message);
    }
};


  return (
    <View style={styles.container}>
      <Text style={styles.deckTitle}>
        {deckTitle ? deckTitle : 'Loading...'}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button1}>
          <Text style={styles.buttonText1}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToFlashcardPage} style={styles.button1}>
          <Text style={styles.buttonText1}>View Flashcards</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
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
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 10 },
  inputContainer: { marginVertical: 10 },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  deckTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button1: {
    flex: 1,
    backgroundColor: '#6200ea',
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText1: { color: '#fff', fontWeight: 'bold' },
});

export default DeckScreen;  