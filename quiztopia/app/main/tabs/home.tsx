import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


function HomePage() {
  const [myDecks, setMyDecks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recentActivity, setRecentActivity] = useState(null); // Only one deck at a time
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState(null); // To store the deck that is being deleted

  const fetchDecks = useCallback(async () => {
    if (!email) return;

    try {
      const response = await axios.get('http://192.168.1.9:3000/api/decks', { params: { email } });
      const decks = response.data.data;
      setMyDecks(decks);
      setFavorites(decks.filter((deck) => deck.isFavorite));
    } catch (err) {
      console.error('Error fetching decks:', err.response?.data || err.message);
    }
  }, [email]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      if (storedEmail) setEmail(storedEmail);
    };
    fetchUserEmail();
  }, []);

  useEffect(() => {
    fetchDecks();
  }, [email, fetchDecks]);

  const toggleFavorite = async (deckId) => {
    try {
      const response = await axios.patch(`http://192.168.1.9:3000/api/decks/${deckId}/toggle-favorite`, { email });
      const updatedDeck = response.data.data;

      setMyDecks((prev) =>
        prev.map((deck) => (deck._id === updatedDeck._id ? updatedDeck : deck))
      );
      setFavorites((prev) =>
        updatedDeck.isFavorite
          ? [...prev, updatedDeck]
          : prev.filter((deck) => deck._id !== updatedDeck._id)
      );
      setRecentActivity((prev) =>
        prev && prev._id === updatedDeck._id
          ? { ...prev, isFavorite: updatedDeck.isFavorite }
          : prev
      );
    } catch (err) {
      console.error('Error toggling favorite:', err.message);
    }
  };

  const navigateToDeck = (deckId) => {
    const deck = myDecks.find((d) => d._id === deckId);
    if (deck) setRecentActivity(deck);
    navigation.navigate('FlashcardPage', { deckId });
  };

  const deleteDeck = async () => {
    if (!email) {
      Alert.alert('Error', 'Email is required for deleting decks.');
      return;
    }
  
    try {
      await axios.delete(`http://192.168.1.9:3000/api/decks/${deckToDelete._id}`, {
        data: { email } // Send the email in the request body
      });
  
      Alert.alert('Success', 'Deck deleted successfully');
  
      // Remove the deleted deck from both 'myDecks' and 'favorites' arrays
      setMyDecks((prevDecks) => prevDecks.filter(deck => deck._id !== deckToDelete._id));
      setFavorites((prevFavorites) => prevFavorites.filter(deck => deck._id !== deckToDelete._id));
  
      // Update recent activity if the deleted deck was part of it
      if (recentActivity && recentActivity._id === deckToDelete._id) {
        setRecentActivity(null);
      }
  
      fetchDecks(); // Refresh the decks after deletion, this may be redundant now
  
    } catch (err) {
      console.error('Error deleting deck:', err.response?.data || err.message);
      Alert.alert('Error', 'Failed to delete deck. Please try again.');
    }
  
    setModalVisible(false);
  };
  
  
  const handleDeleteClick = (deck) => {
    setDeckToDelete(deck); // Set the deck to be deleted
    setModalVisible(true);  // Show the modal
  };
  
    
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorites ({favorites.length})</Text>
      <View style={styles.sectionContainer}>
        {favorites.length > 0 ? (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.cardRow}>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigateToDeck(item._id)}
                >
                  <View style={styles.cardHeaderRow}>
                    <Ionicons
                      name={item.isFavorite ? 'star' : 'star-outline'}
                      size={24}
                      color={item.isFavorite ? 'gold' : 'grey'}
                      onPress={() => toggleFavorite(item._id)}
                    />
                  

                    <View style={styles.cardTitleContainer}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardSubtitle}>{item.flashcards.length} cards</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteClick(recentActivity)}>
  <Ionicons name="trash-bin" size={30} color="grey" />
</TouchableOpacity>
                  </View>
                </TouchableOpacity>
                
              </View>
            )}
          />
        ) : (
          <Text>No decks added to favorites.</Text>
        )}
      </View>

      <Text style={styles.header}>Recent Activity</Text>
      <View style={styles.sectionContainer}>
        {recentActivity ? (
          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => navigateToDeck(recentActivity._id)}
            activeOpacity={0.9}
            android_ripple={{ color: '#cccccc', borderless: false }}
          >
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <TouchableOpacity onPress={() => toggleFavorite(recentActivity._id)}>
                  <Ionicons
                    name={recentActivity.isFavorite ? 'star' : 'star-outline'}
                    size={24}
                    color={recentActivity.isFavorite ? 'gold' : 'grey'}
                  />
                </TouchableOpacity>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>{recentActivity.title}</Text>
                  <Text style={styles.cardSubtitle}>{recentActivity.flashcards.length} cards</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteClick(recentActivity)}>
  <Ionicons name="trash-bin" size={30} color="grey" />
</TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <Text>No recent activity.</Text>
        )}
      </View>

      <Text style={styles.header}>My Decks ({myDecks.length})</Text>
      <FlatList
        data={myDecks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.cardRow}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigateToDeck(item._id)}
            >
              <View style={styles.cardHeaderRow}>
                <Ionicons
                  name={item.isFavorite ? 'star' : 'star-outline'}
                  size={24}
                  color={item.isFavorite ? 'gold' : 'grey'}
                  onPress={() => toggleFavorite(item._id)}
                />
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.flashcards.length} cards</Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteClick(item)}>
                  <Ionicons name="trash-bin" size={30} color="grey" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal for Deletion Confirmation */}
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this deck?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={deleteDeck}
                style={styles.confirmButton}
              >
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

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 18,
    color: '#3C096C',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionContainer: {
    marginBottom: 20,
    height: 100,
  },
  cardRow: {
    marginVertical: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});