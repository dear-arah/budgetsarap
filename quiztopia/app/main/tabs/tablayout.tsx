import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './home';
import ProgressScreen from './progress';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TabLayout({ navigation }: { navigation: any }) {
  
  const [currentTab, setCurrentTab] = useState('Home');
  const [isModalVisible, setModalVisible] = useState(false);
  const [deckTitle, setDeckTitle] = useState('');


const addDeck = async () => {
  if (!deckTitle) {
    alert('Deck name is required');
    return;
  }

  try {
    const token = await AsyncStorage.getItem('userToken'); // Assuming you're storing tokens
    const response = await axios.post(
      'http://localhost:3000/api/decks/create-deck',
      { title: deckTitle },
      { headers: { 'x-access-token': token } }
    );

    if (response.data.status === 'ok') {
      alert('Deck created successfully!');
      setDeckTitle('');
      setModalVisible(false);
    } else {
      alert(response.data.data);
    }
  } catch (err) {
    console.error(err);
    alert('Error creating deck');
  }
};

  const renderScreen = () => {
    switch (currentTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Progress':
        return <ProgressScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Screen Content */}
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Modal for Add Button */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
  
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
              <Text> Name for Your Deck:</Text>

                  <View style={styles.action}>
                  <TextInput
                      placeholder="Enter Deck Name"
                      style={styles.textInput}
                      value={deckTitle}
                      onChangeText={setDeckTitle}
                  />
                  </View>

                  <TouchableOpacity style={styles.modalOption} onPress={addDeck}>
                  <Ionicons name="albums-outline" size={20} color="#5A189A" />
                  <Text style={styles.modalOptionText}>Add Deck</Text>
                  </TouchableOpacity>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Bottom Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => setCurrentTab('Home')}>
          <Ionicons
            name="home-outline"
            size={20}
            color={currentTab === 'Home' ? '#FF9100' : '#8e8e93'}
          />
          <Text style={{ color: currentTab === 'Home' ? '#FF9100' : '#8e8e93' }}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={20} color="#8e8e93" />
          <Text style={{ color: '#8e8e93' }}>Add</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => setCurrentTab('Progress')}>
          <Ionicons
            name="stats-chart-outline"
            size={20}
            color={currentTab === 'Progress' ? '#FF9100' : '#8e8e93'}
          />
          <Text style={{ color: currentTab === 'Progress' ? '#FF9100' : '#8e8e93' }}>Progress</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenContainer: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
  },
  tabButton: { alignItems: 'center' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalOption: {
    padding: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: { fontSize: 16, fontWeight: 'bold', color: '#5A189A' },
  action: {
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 3,
    marginTop: 15,

    paddingHorizontal: 15,

    borderWidth: 1,
    borderColor: '#420475',
    borderRadius: 50,
  },
  textInput: {
    flex: 1,
    marginTop: -12,
    color: '#05375a',
  },
});

export default TabLayout;
