import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

function FlashcardPage({ route }) {
  const { deckId } = route.params;
  const [flashcards, setFlashcards] = useState([]);
  const [deckTitle, setDeckTitle] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completedCards, setCompletedCards] = useState(new Set()); // Track completed flashcards
  const [progress, setProgress] = useState(0); // Track progress percentage
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
          `http://192.168.1.9:3000/api/decks/${deckId}`,
          { params: { email: storedEmail } }
        );
  
        const { flashcards: fetchedFlashcards, title } = response.data.data;
        setFlashcards(fetchedFlashcards || []);
        setDeckTitle(title || 'Untitled Deck');
  
        // Load previously studied cards for this deck
        const studied = await AsyncStorage.getItem('flashcardsStudied');
        const studiedSet = new Set(studied ? JSON.parse(studied) : []);
        const completedInDeck = new Set(
          [...studiedSet].filter((key) => key.startsWith(`${deckId}-`))
            .map((key) => parseInt(key.split('-')[1], 10)) // Extract the flashcard index
        );
  
        setCompletedCards(completedInDeck); // Restore completed cards
      } catch (err) {
        console.error('Error fetching flashcards:', err.response?.data || err.message);
      }
    };
  
    fetchDeckData();
  }, [deckId]);
  

  useEffect(() => {
    // Calculate the progress when completedCards or flashcards change
    setProgress((completedCards.size / flashcards.length) * 100);
  }, [completedCards, flashcards]);

  const flipCard = () => {
    setShowAnswer((prev) => {
      // If showing the answer for the first time, mark the card as completed
      if (!prev) {
        markCardAsCompleted(currentIndex);
      }
      return !prev;
    });
  };
  

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    markCardAsCompleted(currentIndex); // Mark current card as completed
  };

  const prevCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const markCardAsCompleted = async (index) => {
    setCompletedCards((prevCompleted) => {
      const newCompleted = new Set(prevCompleted);
      newCompleted.add(index);
  
      // Save unique studied flashcards to AsyncStorage
      AsyncStorage.getItem('flashcardsStudied').then((studied) => {
        const studiedSet = new Set(studied ? JSON.parse(studied) : []);
        studiedSet.add(`${deckId}-${index}`); // Use unique identifier per deck and flashcard
        AsyncStorage.setItem('flashcardsStudied', JSON.stringify([...studiedSet]));
      });
  
      return newCompleted;
    });
  };
  

  if (!flashcards.length) {
    return (
      <View style={styles.container}>
        <Text>No flashcards in this deck!</Text>

        {/* Navigate to Deckscreen.tsx */}
        <TouchableOpacity
        style={styles.quizButton}
        onPress={() => navigation.navigate('Deck', { deckId })}
        > 
          <Text style={styles.buttonText}>Create Flashcards</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentFlashcard = flashcards[currentIndex];

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0); // Reset to the first card after shuffle
    setShowAnswer(false);
  };

  return (
    <View style={styles.container}>
     {/* Top Row Buttons */}
    <View style={styles.topRow}>
      {/* Home Button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="home" size={25} color="#5A189A" />
      </TouchableOpacity>

      {/* Quiztopia Mode Button */}
      <TouchableOpacity
        style={styles.quizButton}
        onPress={() => navigation.navigate('QuizPage', { deckId, deckTitle, flashcards })}
      >
        <Text style={styles.buttonText}>Quiztopia Mode</Text>
      </TouchableOpacity>
    </View>  

    {/* Area */}
    <View style={styles.area}> 
 {/* Deck Title */}
 <Text style={styles.deckTitle}>{deckTitle}</Text>
      {/* Progress */}
      <Text style={styles.progressText}>Progress: {Math.round(progress)}%</Text>

      {/* Buttons Row */}
      <View style={styles.topButtons}>
        {/* Edit Flashcards Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('Deck', { deckId })}
        >
          <Ionicons name="pencil" size={22} color="#5A189A" style={styles.smallIcon}/>
        </TouchableOpacity>

        {/* Card Count */}
        <Text style={styles.cardCount}>
                {currentIndex + 1}/{flashcards.length}
              </Text>

          {/* Shuffle Button */}
        <TouchableOpacity onPress={shuffleCards}>
          <Ionicons name="shuffle" size={24} color="#5A189A" style={styles.smallIcon}/>
        </TouchableOpacity>
      </View>

      {/* Flashcard */}
      <TouchableOpacity onPress={flipCard} style={styles.card}>
        <Text style={styles.cardText}>
          {showAnswer ? currentFlashcard.answer : currentFlashcard.question}
        </Text>
      </TouchableOpacity>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity onPress={prevCard} style={styles.navButton}>
        <Ionicons name="chevron-back-outline" size={18} color="#fff" style={styles.smallIcon}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextCard} style={styles.navButton}>
        <Ionicons name="chevron-forward-outline" size={18} color="#fff" style={styles.smallIcon}/>
        </TouchableOpacity>
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  area:{
    backgroundColor: '#f5f5f5', 
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%',
    height: '80%'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 30, // Adjust horizontal padding as needed
    marginBottom: 4, // Add spacing below the row
  },
  deckTitle: { fontSize: 24, color: '#3C096C', fontWeight: 'bold', },
  progressText: { fontSize: 14, marginBottom: 40, color: '#FF9100', },
  topButtons: {
    flexDirection: 'row', // Arrange items in a row
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Space items evenly across the row
    width: '80%', // Adjust as needed to control spacing
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontSize: 12,},
  buttonText1: { backgroundColor: '#6200ea', padding: 10, marginRight: 10, color: '#fff', fontWeight: 'bold' },
  cardCount: {
    fontSize: 18,
    textAlign: 'center',
  },
  card: {
    width: 280,
    height: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    elevation: 3,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  cardText: { fontSize: 18, textAlign: 'center' },
  navigationButtons: { flexDirection: 'row', marginTop: 20 },
  navButton: {
    backgroundColor: '#d3d3d3',
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 40,
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
  quizButton: {
    backgroundColor: '#5A189A',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
});

export default FlashcardPage;
