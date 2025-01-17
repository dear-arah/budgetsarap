import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const saveQuizResult = async (deckTitle, quizType, score, total) => {
  try {
    const newEntry = {
      deckTitle,
      quizType,
      date: new Date().toLocaleDateString(),
      score: `${score}/${total}`,
    };

    const existingHistory = await AsyncStorage.getItem('quizHistory');
    const updatedHistory = existingHistory ? JSON.parse(existingHistory) : [];
    
    // Check if the entry already exists
    const isDuplicate = updatedHistory.some(
      (entry) =>
        entry.deckTitle === newEntry.deckTitle &&
        entry.quizType === newEntry.quizType &&
        entry.date === newEntry.date
    );

    if (!isDuplicate) {
      updatedHistory.push(newEntry);
      await AsyncStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
    }
  } catch (error) {
    console.error('Error saving quiz result:', error);
  }
};

function QuizYourself({ route, navigation }) {
  const { flashcards, deckId, deckTitle: initialDeckTitle } = route.params || {};
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deckTitle, setDeckTitle] = useState(initialDeckTitle || 'Untitled Deck');
  const progress = useRef(new Animated.Value(0)).current; // Persist Animated.Value

  useEffect(() => {
    // Fetch the deck title only if not provided
    if (!initialDeckTitle) {
      const fetchDeckTitle = async () => {
        try {
          const storedEmail = await AsyncStorage.getItem('userEmail');
          if (!storedEmail) {
            Alert.alert('Error', 'User email not found. Please log in again.');
            return;
          }

          const response = await axios.get(
            `http://192.168.1.9:3000/api/decks/${deckId}`,
            { params: { email: storedEmail } }
          );

          const { title } = response.data.data;
          setDeckTitle(title || 'Untitled Deck');
        } catch (err) {
          console.error('Error fetching deck title:', err);
          Alert.alert('Error', 'Failed to load deck title. Please try again.');
        }
      };

      fetchDeckTitle();
    }
  }, [deckId, initialDeckTitle]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: currentQuestionIndex / flashcards.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex]);

  const currentFlashcard = flashcards[currentQuestionIndex];

  const handleAnswerCheck = (isCorrect) => {
    if (isCorrect) setScore((prev) => prev + 1);

    setIsFlipped(false);
    if (currentQuestionIndex + 1 < flashcards.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleFlipCard = () => {
    setIsFlipped((prev) => !prev);
  };

  if (showResult) {
    saveQuizResult(deckTitle, 'Quiz Yourself', score, flashcards.length);
    return (
      <View style={styles.container}>
        <View style={styles.area}> 
        <Image
                style={styles.sun}
                source={require("../../../assets/images/amazing.png")}
        />
        <Text style={styles.resultText1}>Quiz Completed!</Text>
        <Text style={styles.resultText2}>
          Your Score: {score}/{flashcards.length}
        </Text>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back to Quiz Types</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>
          Score: {score}/{flashcards.length}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarWrapper}>
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.percentageText}>
          {Math.round((currentQuestionIndex / flashcards.length) * 100)}%
        </Text>
      </View>

      <TouchableWithoutFeedback onPress={handleFlipCard}>
        <View style={[styles.card, isFlipped ? styles.cardBack : styles.cardFront]}>
          {isFlipped ? (
            <Text style={styles.cardText}>{currentFlashcard.answer}</Text>
          ) : (
            <Text style={styles.cardText}>{currentFlashcard.question}</Text>
          )}
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.answerCheckContainer}>
        <Text style={styles.promptText}>
          Did you get it correct? Press ✔ for Yes or ✖ for No.
        </Text>
        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={styles.wrongButton}
            onPress={() => handleAnswerCheck(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.correctButton}
            onPress={() => handleAnswerCheck(true)}
          >
            <Ionicons name="checkmark" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 },
  scoreText: { fontSize: 16, fontWeight: 'bold', color:'#3C096C' },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#5A189A',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5A189A',
  },
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardFront: { backgroundColor: '#fff' },
  cardBack: { backgroundColor: '#f9f9f9' },
  cardText: { fontSize: 18, textAlign: 'center' },
  answerCheckContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  promptText: { fontSize: 14, marginBottom: 10, textAlign: 'center',},
  answerButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '60%' },
  correctButton: { backgroundColor: '#4B6F44', padding: 15, borderRadius: 4, marginHorizontal: 5, width: '70%', alignItems: 'center',},
  wrongButton: { backgroundColor: '#97233F', padding: 15, borderRadius: 4, marginHorizontal: 5, width: '70%', alignItems: 'center',},
  buttonText: { color: '#fff', textAlign: 'center' },
  resultText1: { fontSize: 18, fontWeight: 'bold', textAlign: 'center'},
  resultText2: { fontSize: 14, textAlign: 'center', marginBottom: 10 },
  homeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffa500',
    borderRadius: 5,
  },
  area:{
    backgroundColor: '#fff', 
    padding: 20,
    width: '90%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    elevation: 2,
  },
  sun:{
    height: 120,
    width: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
});

export default QuizYourself;
