import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';


function HomePage() {
  // Example data for demonstration
  const recentActivity = [
    { id: '1', title: 'Plants', mode: 'Multiple choice mode', progress: '90%' },
  ];


  const myDecks = [
    { id: '1', title: 'Genetics', cards: 34 },
    { id: '2', title: 'French Revolution', cards: 65 },
  ];


  return (
    <View style={styles.container}>
      {/* Section 1: My Favorites */}
      <Text style={styles.header}>My Favorites</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>No favorites yet. Add some!</Text>
      </View>


      {/* Section 2: Recent Activity */}
      <Text style={styles.header}>Recent Activity</Text>
      {recentActivity.length > 0 ? (
        <FlatList
          data={recentActivity}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.mode}</Text>
              <Text style={styles.cardProgress}>{item.progress}</Text>
            </View>
          )}
        />
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardText}>No recent activity.</Text>
        </View>
      )}


      {/* Section 3: My Decks */}
      <Text style={styles.header}>My Decks</Text>
      {myDecks.length > 0 ? (
        <FlatList
          data={myDecks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.cards} cards</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardText}>No decks created yet. Add a new deck!</Text>
        </View>
      )}
    </View>
  );
}
export default HomePage;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5', // Light background color
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5A189A',
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#240046',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  cardProgress: {
    fontSize: 14,
    color: '#9D4EDD', // Green for progress
    marginTop: 5,
  },
});




