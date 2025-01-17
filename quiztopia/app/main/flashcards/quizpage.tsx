import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

function QuizPage({ route, navigation }) {
  const { deckId, deckTitle, flashcards } = route.params || {}; // Safely destructure

  return (
    <View style={styles.container}>
      <View style={styles.area}> 
      <Image
        style={styles.sun}
        source={require("../../../assets/images/sun.png")}
      />
      <Text style={styles.title}>Select Quiz Type</Text>
      
      <TouchableOpacity
        style={styles.quizTypeButton}
        onPress={() => navigation.navigate('QuizYourself', { deckId, deckTitle, flashcards })}
      >
        <Text style={styles.buttonText}>Quiz Yourself</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.quizTypeButton}
        onPress={() => navigation.navigate('MultipleChoiceQuiz', { deckId, deckTitle, flashcards })}
      >
        <Text style={styles.buttonText}>Multiple Choice Quiz</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.quizTypeButton}
        onPress={() => navigation.navigate('IdentificationQuiz', { deckId, deckTitle, flashcards })}
      >
        <Text style={styles.buttonText}>Identification Quiz</Text>
      </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  area:{
    backgroundColor: '#fff', 
    padding: 20,
    width: '90%',
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    color: '#240046',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  quizTypeButton: {
    backgroundColor: '#5A189A',
    padding: 15,
    borderRadius: 40,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  sun:{
    height: 120,
    width: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
});

export default QuizPage;
