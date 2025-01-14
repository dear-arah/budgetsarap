import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';

function IdentificationQuiz({ route, navigation }) {
  const { flashcards } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showScoreScreen, setShowScoreScreen] = useState(false);
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [localFlashcards, setLocalFlashcards] = useState([]);
  const progress = useRef(new Animated.Value(0)).current; // Persist Animated.Value

  useEffect(() => {
    // Initialize local flashcards for tracking user answers
    setLocalFlashcards([...flashcards]);
  }, [flashcards]);

  useEffect(() => {
    // Animate the progress bar when the question index changes
    Animated.timing(progress, {
        toValue: currentIndex / flashcards.length, // Start at 0% progress
        duration: 300,
        useNativeDriver: false,
      }).start();      
  }, [currentIndex]);

  const handleAnswerSubmit = () => {
    const isCorrect =
      userAnswer.trim().toLowerCase() ===
      flashcards[currentIndex].answer.trim().toLowerCase();

    if (isCorrect) setScore((prev) => prev + 1);

    // Update local flashcards with user answers
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
          <Text style={styles.buttonText}>Back to Flashcards</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (showScoreScreen) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>Quiz Completed!</Text>
        <Text style={styles.resultText}>
          Your Score: {score}/{flashcards.length}
        </Text>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleReviewResults}
        >
          <Text style={styles.buttonText}>Review Results</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <Text style={styles.scoreText}>
      Score: {score}/{flashcards.length}
    </Text>
      <View style={styles.header}>
  <View style={styles.scoreContainer}>
  </View>
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
            backgroundColor: '#6200ea',
          },
        ]}
      />
    </View>
    <Text style={styles.percentageText}>
      {Math.round((currentIndex / flashcards.length) * 100)}%
    </Text>
  </View>
</View>

        <View style={styles.card}>
                <Text style={styles.question}>Question:</Text>
                <Text style={styles.cardText}>{flashcards[currentIndex].question}</Text>
        </View>
      <TextInput
        style={styles.input}
        placeholder="Type your answer here"
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
      scoreText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
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
        marginBottom: 10,
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
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 20,
      width: '100%',
    },
    submitButton: { backgroundColor: '#6200ea', padding: 15, borderRadius: 8 },
    buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
    resultText: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
    reviewCard: { padding: 10, borderRadius: 5, backgroundColor: '#f9f9f9', marginBottom: 10 },
    reviewQuestion: { fontSize: 16, marginBottom: 5 },
    reviewAnswer: { fontSize: 14, marginBottom: 5 },
    correctAnswer: { color: 'green', fontSize: 14 },
    wrongAnswer: { color: 'red', fontSize: 14 },
    scrollViewContent: { padding: 20 },
    homeButton: {
      marginTop: 20,
      padding: 15,
      backgroundColor: '#ffa500',
      borderRadius: 5,
    },
});

export default IdentificationQuiz;
