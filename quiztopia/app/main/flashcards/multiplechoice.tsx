import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
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

function MultipleChoiceQuiz({ route, navigation }) {
  const { flashcards, deckId, deckTitle: initialDeckTitle } = route.params || {};
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerState, setAnswerState] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [localFlashcards, setLocalFlashcards] = useState([]);
  const [highlightedAnswers, setHighlightedAnswers] = useState({});
  const [options, setOptions] = useState([]); // Store the options for the current question
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
    setLocalFlashcards([...flashcards]); // Copy the flashcards into a local state
    generateOptions(); // Generate options for the first question
  }, [flashcards]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: currentQuestionIndex / flashcards.length,
      duration: 300,
      useNativeDriver: false,
    }).start();

    generateOptions(); // Generate options when the question index changes
  }, [currentQuestionIndex]);

  const generateOptions = () => {
    const correctAnswer = flashcards[currentQuestionIndex].answer;
    const incorrectOptions = flashcards
      .map((fc) => fc.answer)
      .filter((ans) => ans !== correctAnswer);
    const shuffledOptions = [correctAnswer, ...incorrectOptions.sort(() => 0.5 - Math.random()).slice(0, 3)];
    setOptions(shuffledOptions.sort(() => 0.5 - Math.random()));
  };

  const handleAnswer = (option) => {
    const isCorrect = option === flashcards[currentQuestionIndex].answer;

    setHighlightedAnswers({
      correct: flashcards[currentQuestionIndex].answer,
      wrong: isCorrect ? null : option,
    });

    setSelectedOption(option);
    setScore((prev) => (isCorrect ? prev + 1 : prev));
    setAnswerState(isCorrect ? 'correct' : 'wrong');

    const updatedFlashcards = localFlashcards.map((flashcard, index) => {
      if (index === currentQuestionIndex) {
        return { ...flashcard, userAnswer: option };
      }
      return flashcard;
    });
    setLocalFlashcards(updatedFlashcards);

    setTimeout(() => {
      if (currentQuestionIndex + 1 < flashcards.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setAnswerState(null);
        setHighlightedAnswers({});
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  if (showResult) {
    saveQuizResult(deckTitle, 'Multiplechoice Quiz', score, flashcards.length);
    return reviewMode ? (
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.resultText}>Review Results</Text>
        {localFlashcards.map((flashcard, index) => (
          <View key={index} style={styles.reviewCard}>
            <Text style={styles.question}>
              {index + 1}. {flashcard.question}
            </Text>
            <Text
              style={[
                styles.reviewAnswer,
                flashcard.answer === flashcard.userAnswer
                  ? styles.correctAnswer
                  : styles.wrongAnswer,
              ]}
            >
              Your Answer: {flashcard.userAnswer || 'No Answer'}
            </Text>
            <Text style={styles.correctAnswer}>Correct Answer: {flashcard.answer}</Text>
          </View>
        ))}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back to Quiz Types</Text>
        </TouchableOpacity>
      </ScrollView>
    ) : (
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
                onPress={() => setReviewMode(true)}
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

      <View style={styles.card}>
        <Text style={styles.question}>Question:</Text>
        <Text style={styles.cardText}>
          {flashcards[currentQuestionIndex].question}
        </Text>
      </View>

      <View style={styles.optionsArea}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              highlightedAnswers.correct === option
                ? styles.correctOption
                : highlightedAnswers.wrong === option
                ? styles.wrongOption
                : null,
            ]}
            onPress={() => handleAnswer(option)}
            disabled={!!selectedOption}
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  scoreText: { fontSize: 16, fontWeight: 'bold', color: '#3C096C', },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Space below the progress bar
    width: '100%', // Full width of the parent container
  },
  
  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0', // Gray background for the progress bar
    borderRadius: 5,
    overflow: 'hidden',
    marginRight: 10, // Space between the progress bar and percentage text
  },
  
  progressBar: {
    height: '100%',
    backgroundColor: '#5A189A', // Purple color for the animated bar
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
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',
    marginBottom: 10,
},
question:{
    fontSize: 15,
},
cardText: { 
    fontSize: 18, 
    textAlign: 'center',
  },    
  optionsArea:{
    width: '80%',
  },
  optionButton: { backgroundColor: '#3C096C', padding: 15, marginVertical: 4, borderRadius: 10, width: '100%' },
  correctOption: { backgroundColor: '#4B6F44' },
  wrongOption: { backgroundColor: '#97233F' },
  buttonText: { color: '#fff', textAlign: 'center' },
  homeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffa500',
    borderRadius: 5,
  },
  reviewCard: {
    width: '100%',
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
  },
  reviewAnswer: { fontSize: 14, marginVertical: 5, },
  correctAnswer: { color: '#00563B', fontSize: 14 },
  wrongAnswer: { color: '#C60C30', fontSize: 14 },
  scrollViewContent: {
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
    padding: 20, // Add padding if needed
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
  },
  resultText1: { fontSize: 18, fontWeight: 'bold', textAlign: 'center'},
  resultText2: { fontSize: 14, textAlign: 'center', marginBottom: 10 },
});

export default MultipleChoiceQuiz;
