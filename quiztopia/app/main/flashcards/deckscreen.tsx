import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function DeckScreen({ route }) {
  const { deckId } = route.params;
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [deckTitle, setDeckTitle] = useState('');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFlashcardId, setSelectedFlashcardId] = useState(null);
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

  const deleteFlashcard = async () => {
    if (!selectedFlashcardId) return;

    try {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (!storedEmail) {
        alert('User email not found. Please log in again.');
        return;
      }

      await axios.delete(`http://192.168.1.6:3000/api/decks/${deckId}/flashcards/${selectedFlashcardId}`, {
        data: { email: storedEmail },
      });

      Alert.alert('Flashcard deleted successfully');
      setFlashcards(flashcards.filter((card) => card._id !== selectedFlashcardId));
      setModalVisible(false); // Close the modal after deletion
    } catch (err) {
      console.error('Error deleting flashcard:', err.response?.data || err.message);
      alert('Failed to delete flashcard. Please try again.');
    }
  };

  const openDeleteModal = (flashcardId) => {
    setSelectedFlashcardId(flashcardId);
    setModalVisible(true);
  };

  // Function to handle editing a flashcard
  const editFlashcard = (flashcardId) => {
    // You can navigate to an EditFlashcardPage if needed
    console.log('Edit flashcard with ID:', flashcardId);
    // Here you can implement navigation to an edit screen if needed
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

            <View style={styles.cardRow}>
              {/* Pencil Icon for Editing */}
              <TouchableOpacity onPress={() => editFlashcard(item._id)}>
                <Icon name="pencil" size={20} color="#6200ea" style={styles.icon} />
              </TouchableOpacity>

              {/* Trash Icon for Deleting */}
              <TouchableOpacity onPress={() => openDeleteModal(item._id)}>
                <Icon name="trash-can" size={20} color="red" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal for Deletion Confirmation */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this flashcard?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={deleteFlashcard} style={styles.confirmButton}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  cardRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  icon: { marginHorizontal: 10 },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalText: { fontSize: 16, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  confirmButton: {
    backgroundColor: '#e60000',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
});

export default DeckScreen;
