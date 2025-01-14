import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';

function QuizYourself({ route, navigation }) {
  const { flashcards } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const progress = useRef(new Animated.Value(0)).current; // Persist Animated.Value

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
    return (
      <View style={styles.container}>
        <Text style={styles.resultText}>Quiz Completed!</Text>
        <Text style={styles.resultText}>
          Your Score: {score}/{flashcards.length}
        </Text>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Back to Flashcards</Text>
        </TouchableOpacity>
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
          Did you get it correct? Press ✔️ for Yes or ❌ for No.
        </Text>
        <View style={styles.answerButtons}>
          <TouchableOpacity
            style={styles.correctButton}
            onPress={() => handleAnswerCheck(true)}
          >
            <Text style={styles.buttonText}>✔️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wrongButton}
            onPress={() => handleAnswerCheck(false)}
          >
            <Text style={styles.buttonText}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 },
  scoreText: { fontSize: 16, fontWeight: 'bold' },
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
    backgroundColor: '#6200ea',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: 'bold',
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
  answerCheckContainer: { alignItems: 'center', marginTop: 20 },
  promptText: { fontSize: 14, marginBottom: 10 },
  answerButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '60%' },
  correctButton: { backgroundColor: 'green', padding: 15, borderRadius: 10, marginHorizontal: 5 },
  wrongButton: { backgroundColor: 'red', padding: 15, borderRadius: 10, marginHorizontal: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
  resultText: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  homeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffa500',
    borderRadius: 5,
  },
});

export default QuizYourself;
