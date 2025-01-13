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
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [editFlashcard, setEditFlashcard] = useState(null);
  const [editDeckModalVisible, setEditDeckModalVisible] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
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
    if (!editFlashcard?._id) return;

    try {
      await axios.delete(`http://192.168.1.6:3000/api/decks/${deckId}/flashcards/${editFlashcard._id}`, {
        data: { email }
      });

      Alert.alert('Flashcard deleted successfully');
      setFlashcards(flashcards.filter((card) => card._id !== editFlashcard._id));
      setModalVisible(false); // Close the modal after deletion
    } catch (err) {
      console.error('Error deleting flashcard:', err.response?.data || err.message);
      alert('Failed to delete flashcard. Please try again.');
    }
  };

  const openDeleteModal = (flashcardId) => {
    const flashcard = flashcards.find((card) => card._id === flashcardId);
    setEditFlashcard(flashcard);
    setModalVisible(true);
  };

  // Function to handle editing a flashcard
  const openEditModal = (flashcard) => {
    setEditFlashcard(flashcard);
    setNewQuestion(flashcard.question);
    setNewAnswer(flashcard.answer);
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    try {
      const response = await axios.put(
        `http://192.168.1.6:3000/api/decks/${deckId}/flashcards/${editFlashcard._id}`,
        { question: newQuestion, answer: newAnswer, email }
      );

      // Update the flashcard in local state
      setFlashcards(flashcards.map((card) =>
        card._id === editFlashcard._id
          ? { ...card, question: newQuestion, answer: newAnswer }
          : card
      ));

      // Close the modal
      setEditModalVisible(false);
      Alert.alert('Flashcard updated successfully');
    } catch (err) {
      console.error('Error updating flashcard:', err.response?.data || err.message);
      alert('Failed to update flashcard. Please try again.');
    }
  };

  // Function to handle editing the deck title
  const updateDeckTitle = async (deckId, newTitle, email) => {
    if (!email) {
      alert('User email is required for updating the deck title.');
      return;
    }
  
    if (!newTitle) {
      alert('Please enter a valid title.');
      return;
    }
  
    try {
      const response = await axios.put(
        `http://192.168.1.6:3000/api/decks/${deckId}/title`, 
        { title: newTitle },
        { params: { email } }
      );
  
      if (response.data.status === 'ok') {
        setDeckTitle(newTitle); // Update the title in state
        Alert.alert('Deck title updated successfully');
        setEditDeckModalVisible(false); // Close the modal
      } else {
        throw new Error('Failed to update deck title');
      }
    } catch (err) {
      console.error('Error updating deck title:', err.response?.data || err.message);
      alert('Failed to update deck title. Please try again.');
    }
  };
  
  const closeEditDeckModal = () => {
    setNewDeckTitle('');
    setEditDeckModalVisible(false);
  };  
  

  return (
    <View style={styles.container}>
      <Text style={styles.deckTitle}>
  {deckTitle ? deckTitle : 'Loading...'}
  <TouchableOpacity onPress={() => { 
    setNewDeckTitle(deckTitle); 
    setEditDeckModalVisible(true); 
  }}>
    <Icon name="pencil" size={20} color="#6200ea" style={styles.icon} />
  </TouchableOpacity>
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
              <TouchableOpacity onPress={() => openEditModal(item)}>
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

      {/* Edit Flashcard Modal */}
      <Modal visible={editModalVisible} transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Edit Flashcard</Text>

            <TextInput
              value={newQuestion}
              onChangeText={setNewQuestion}
              placeholder="Edit Question"
              style={styles.textInput}
            />
            <TextInput
              value={newAnswer}
              onChangeText={setNewAnswer}
              placeholder="Edit Answer"
              style={styles.textInput}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={saveEdit} style={styles.confirmButton}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

 {/* Modal for Editing of card title */}
<Modal visible={editDeckModalVisible} transparent={true}>
  <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalText}>Edit Deck Title</Text>
      <TextInput
        value={newDeckTitle}
        onChangeText={setNewDeckTitle}
        placeholder="Enter new deck title"
        style={styles.textInput}
      />
      <View style={styles.modalButtons}>
        <TouchableOpacity 
          onPress={() => updateDeckTitle(deckId, newDeckTitle, email)} 
          style={[styles.confirmButton, { opacity: newDeckTitle ? 1 : 0.5 }]} 
          disabled={!newDeckTitle}  // Disable if newDeckTitle is empty
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setEditDeckModalVisible(false)} 
          style={styles.cancelButton}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>



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
  },
  button1: {
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonText1: { color: '#fff' },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  icon: { padding: 5 },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  confirmButton: {
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
});


export default DeckScreen;
