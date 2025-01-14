import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function QuizPage({ route, navigation }) {
  const { flashcards } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Quiz Type</Text>
      
      <TouchableOpacity
        style={styles.quizTypeButton}
        onPress={() => navigation.navigate('QuizYourself', { flashcards })}
      >
        <Text style={styles.buttonText}>Quiz Yourself</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.quizTypeButton}
        onPress={() => navigation.navigate('MultipleChoiceQuiz', { flashcards })}
      >
        <Text style={styles.buttonText}>Multiple Choice Quiz</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.quizTypeButton}
        onPress={() => navigation.navigate('IdentificationQuiz', { flashcards })}
      >
        <Text style={styles.buttonText}>Identification Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  quizTypeButton: {
    backgroundColor: '#6200ea',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    width: '80%',
  },
  buttonText: { color: '#fff', fontSize: 18, textAlign: 'center' },
});

export default QuizPage;
