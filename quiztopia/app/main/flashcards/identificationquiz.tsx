import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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

function IdentificationQuiz({ route, navigation }) {
  const { flashcards, deckId, deckTitle: initialDeckTitle } = route.params || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showScoreScreen, setShowScoreScreen] = useState(false);
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [localFlashcards, setLocalFlashcards] = useState([]);
  const [deckTitle, setDeckTitle] = useState(initialDeckTitle || 'Untitled Deck');
  const progress = useRef(new Animated.Value(0)).current;

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
    setLocalFlashcards([...flashcards]);
  }, [flashcards]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: currentIndex / flashcards.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const handleAnswerSubmit = () => {
    const isCorrect =
      userAnswer.trim().toLowerCase() ===
      flashcards[currentIndex].answer.trim().toLowerCase();

    if (isCorrect) setScore((prev) => prev + 1);

    const updatedFlashcards = localFlashcards.map((card, index) =>
      index === currentIndex
        ? { ...card, userAnswer: userAnswer.trim(), isCorrect }
        : card
    );

    setLocalFlashcards(updatedFlashcards);
    setUserAnswer('');

    if (currentIndex + 1 < flashcards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowScoreScreen(true);
    }
  };

  const handleReviewResults = () => {
    setShowScoreScreen(false);
    setShowReviewScreen(true);
  };

  if (showReviewScreen) {
    return (
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.resultText}>Review Your Answers</Text>
        {localFlashcards.map((card, index) => (
          <View key={index} style={styles.reviewCard}>
            <Text style={styles.reviewQuestion}>
              {index + 1}. {card.question}
            </Text>
            <Text
              style={[
                styles.reviewAnswer,
                card.isCorrect ? styles.correctAnswer : styles.wrongAnswer,
              ]}
            >
              Your Answer: {card.userAnswer || 'No Answer'}
            </Text>
            <Text style={styles.correctAnswer}>
              Correct Answer: {card.answer}
            </Text>
          </View>
        ))}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back to Quiz Types</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (showScoreScreen) {
    saveQuizResult(deckTitle, 'Identification Quiz', score, flashcards.length);
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
                      onPress={handleReviewResults}
                    >
                      <Text style={styles.buttonText}>Review Results</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>
        Score: {score}/{flashcards.length}
      </Text>
      <View style={styles.header}>
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
      </View>
      <View style={styles.card}>
        <Text style={styles.question}>Question:</Text>
        <Text style={styles.cardText}>{flashcards[currentIndex].question}</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Type your answer here..."
        value={userAnswer}
        onChangeText={setUserAnswer}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleAnswerSubmit}
        disabled={!userAnswer.trim()}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
    header: {
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
      },
      scoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%', // Ensures the score text stays centered
        marginBottom: 10,
      },
      scoreText: { fontSize: 16, fontWeight: 'bold', color:'#3C096C' },
      progressBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
      },      
    progressBarContainer: {
      flex: 1,
      height: 10,
      backgroundColor: '#e0e0e0',
      borderRadius: 5,
      marginRight: 10,
    },
    progressBar: {
      height: '100%',
      borderRadius: 5, // Ensuring the progress bar has rounded corners
    },
    percentageText: { fontSize: 14, fontWeight: 'bold' },
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
        alignItems: 'center',
        marginBottom: 20,
    },
    question:{
        fontSize: 15,
    },
    cardText: { 
        fontSize: 18, 
        textAlign: 'center',
      },    
    input: {
      borderWidth: 1,
      borderColor: '#b19dc4',
      borderRadius: 4,
      padding: 20,
      marginBottom: 20,
      width: '100%',
    },
    submitButton: { backgroundColor: '#3C096C', padding: 15, marginVertical: 4, borderRadius: 10, width: '100%' },
    buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
    reviewCard: { padding: 10, borderRadius: 5, backgroundColor: '#f9f9f9', marginBottom: 10 },
    reviewQuestion: { fontSize: 16, marginBottom: 5 },
    reviewAnswer: { fontSize: 14, marginBottom: 5 },
    correctAnswer: { color: '#00563B', fontSize: 14 },
    wrongAnswer: { color: '#C60C30', fontSize: 14 },
    scrollViewContent: { padding: 20 },
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
    resultText:{
      marginTop: 30,
      marginBottom: 10,
      fontSize: 18, 
      fontWeight: 'bold',
      textAlign: 'center',
    },
    resultText1: { fontSize: 18, fontWeight: 'bold', textAlign: 'center'},
    resultText2: { fontSize: 14, textAlign: 'center', marginBottom: 10 },
});

export default IdentificationQuiz;
