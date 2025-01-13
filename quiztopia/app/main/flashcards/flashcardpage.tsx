import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


function FlashcardPage({ route }) {
  const { deckId } = route.params;
  const [flashcards, setFlashcards] = useState([]);
  const [deckTitle, setDeckTitle] = useState(''); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();


  useEffect(() => {
    const fetchDeckData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (!storedEmail) {
          alert('User email not found. Please log in again.');
          return;
        }

        const response = await axios.get(
          `http://192.168.1.6:3000/api/decks/${deckId}`,
          { params: { email: storedEmail } } // Pass email in query parameters
        );

        const { flashcards: fetchedFlashcards, title } = response.data.data;

        setFlashcards(fetchedFlashcards || []);
        setDeckTitle(title || 'Untitled Deck'); // Set the deck title
      } catch (err) {
        console.error('Error fetching flashcards:', err.response?.data || err.message);
      }
    };

    fetchDeckData();
  }, [deckId]);

  const flipCard = () => setShowAnswer((prev) => !prev);

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };


  const deleteFlashcard = async (flashcardId) => {
    try {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (!storedEmail) {
        alert('User email not found. Please log in again.');
        return;
      }
  
      // Send DELETE request with email in the body
      await axios.delete(`http://192.168.1.6:3000/api/decks/${deckId}/flashcards/${flashcardId}`, {
        data: { email: storedEmail }, // Pass email in the request body
      });
  
      Alert.alert('Flashcard deleted successfully');
      setFlashcards(flashcards.filter((card) => card._id !== flashcardId)); // Remove the deleted flashcard from the state
    } catch (err) {
      console.error('Error deleting flashcard:', err.response?.data || err.message);
      alert('Failed to delete flashcard. Please try again.');
    }
  };
  

  if (!flashcards.length) {
    return (
      <View style={styles.container}>
        <Text>No flashcards in this deck!</Text>
      </View>
    );
  }

  const currentFlashcard = flashcards[currentIndex];

  return (
    <View style={styles.container}>
    {/* Deck Title */}
    <Text style={styles.deckTitle}>{deckTitle}</Text>

    {/* Buttons Row */}

    {/*Back button*/}
    <View style={styles.topButtons}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button1}>
        <Text style={styles.buttonText1}>Back</Text>
    </TouchableOpacity>

    {/*Edit button*/}
    <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('DeckScreen', { deckId })}
        >
          <Text style={styles.buttonText}>Edit Flashcards</Text>
        </TouchableOpacity>

    {/*Delete button*/}
    <TouchableOpacity
        onPress={() => deleteFlashcard(currentFlashcard._id)} // Pass the flashcard ID to delete
        style={styles.deleteButton}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>

    {/* Card Count */}
    <Text style={styles.cardCount}>
      {currentIndex + 1}/{flashcards.length}
    </Text>

    {/* Flashcard */}
    <TouchableOpacity onPress={flipCard} style={styles.card}>
      <Text style={styles.cardText}>
        {showAnswer ? currentFlashcard.answer : currentFlashcard.question}
      </Text>
    </TouchableOpacity>

    {/* Navigation Buttons */}
    <View style={styles.navigationButtons}>
      <TouchableOpacity onPress={prevCard} style={styles.navButton}>
        <Text style={styles.buttonText}>Previous</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={nextCard} style={styles.navButton}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>

     {/* Modal for Deletion Confirmation */}
     <Modal visible={modalVisible} transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            Are you sure you want to delete this flashcard?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              onPress={deleteFlashcard}
              style={styles.confirmButton}
            >
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
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    deckTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    topButtons: { flexDirection: 'row', marginBottom: 20 },
    editButton: { backgroundColor: '#6200ea', padding: 10, marginRight: 10 },
    deleteButton: { backgroundColor: '#b71c1c', padding: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    buttonText1: { backgroundColor: '#6200ea', padding: 10, marginRight: 10, color: '#fff', fontWeight: 'bold' },
    cardCount: { fontSize: 18, marginBottom: 10 },
    card: {
      width: '80%',
      height: '40%',
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 3,
      justifyContent: 'center', // Center content vertically
      alignItems: 'center', // Center content horizontally
    },
    cardText: { 
        fontSize: 18, 
        textAlign: 'center',
      },      
    navigationButtons: { flexDirection: 'row', marginTop: 20 },
    navButton: {
      backgroundColor: '#6200ea',
      padding: 10,
      marginHorizontal: 10,
      borderRadius: 5,
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
      width: '80%',
      padding: 20,
      backgroundColor: '#fff',
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: { fontSize: 18, marginBottom: 20 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    confirmButton: { backgroundColor: '#b71c1c', padding: 10, marginRight: 10 },
    cancelButton: { backgroundColor: '#6200ea', padding: 10 },
});

export default FlashcardPage;