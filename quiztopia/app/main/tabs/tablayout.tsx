import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Animated,
  Easing,
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
  const [isProfileModalVisible, setProfileModalVisible] = useState(false); // New state for profile modal
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [userName, setUserName] = useState<string | null>(null); // State to store the user's name
  const [userEmail, setUserEmail] = useState<string | null>(null); // State to store the user's email
  const slideAnim = useRef(new Animated.Value(300)).current; // Initial position (off-screen right)

  // Fetch the user's data from AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      const name = await AsyncStorage.getItem('userName');
      const email = await AsyncStorage.getItem('userEmail');
      if (name) setUserName(name);
      if (email) setUserEmail(email);
    };
    getUserData();
  }, []);

  const addDeck = async () => {
    if (!deckTitle.trim()) {
        alert('Deck title cannot be empty.');
        return;
    }

    const email = await AsyncStorage.getItem('userEmail'); // Retrieve email from AsyncStorage
    if (!email) {
        alert('User email is not available. Please log in.');
        return;
    }

    try {
        const response = await axios.post('http://192.168.1.9:3000/api/decks/create-deck', {
            email, // Send user email
            title: deckTitle,
        });

        if (response.data.status === 'ok') {
            alert('Deck added successfully');
            setDeckTitle(''); // Clear input after adding
            setModalVisible(false);

             // Increment and save the total number of decks created
            const decksCreated = await AsyncStorage.getItem('totalDecksCreated');
            const newCount = decksCreated ? parseInt(decksCreated, 10) + 1 : 1;
            await AsyncStorage.setItem('totalDecksCreated', newCount.toString());

            // Navigate to DeckScreen with the new deck's ID
            console.log('Navigating to DeckScreen with deckId:', response.data.data._id);
            navigation.navigate('Deck', { deckId: response.data.data._id });
        } else {
            alert('Failed to add deck');
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred while adding the deck.');
    }
};

  //sa tablayout
  // Fetch the user's data from AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        setUserEmail(email);

        try {
          // Fetch the user's username from the backend based on their email
          const response = await axios.get(`http://192.168.1.9:3000/api/user/username?email=${email}`);
          if (response.data.status === 'ok') {
            setUserName(response.data.data.name); // Set username from the backend response
          } else {
            console.error('Failed to fetch username');
          }
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      }
    };
    getUserData();
  }, []);

  
const handleLogout = async () => {
  alert('You have logged out.');
  setProfileModalVisible(false); // Close the profile modal
  navigation.navigate('Login'); // Redirect to login screen
};

 // Slide-in animation effect
 const openProfileModal = () => {
  Animated.timing(slideAnim, {
    toValue: 0, // Slide into visible position
    duration: 300,
    easing: Easing.in(Easing.ease), // Smooth easing effect
    useNativeDriver: true,
  }).start(() => setProfileModalVisible(true)); // Set modal visible after animation
};

const closeProfileModal = () => {
  Animated.timing(slideAnim, {
    toValue: 300, // Slide back to off-screen
    duration: 300,
    useNativeDriver: true,
  }).start(() => setProfileModalVisible(false)); // Hide modal after animation
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
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
        <Image
              style={styles.logo}
              source={require("../../../assets/images/Qlogo.png")}
            />
          <Text style={styles.logoText}>Quiztopia</Text>
        </View>
        <TouchableOpacity onPress={openProfileModal}>
        <Ionicons name="person-circle" size={30} color="white" />
      </TouchableOpacity>
      </View>
      
      {/* Profile Modal */}
      <Modal
        transparent={true}
        visible={isProfileModalVisible}
        animationType="none" // Disable default animation to use custom animation
        onRequestClose={closeProfileModal}
      >
        <TouchableWithoutFeedback onPress={closeProfileModal}>
          <View style={styles.profileModalOverlay} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.profileModalContent,
            { transform: [{ translateX: slideAnim }] }, // Apply slide animation
          ]}
        >
          <Ionicons name="person-circle" size={100} color="#3C096C" style={styles.profileIcon} />
          <Text style={styles.profileText1}>
            Hello, {userName ? userName : 'User'}! {/* Display the user's name here */}
          </Text>
          <Text style={styles.profileText2}>
            {userEmail ? userEmail : 'Not Available'} {/* Display the user's email here */}
          </Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setShowLogoutConfirmation(true)}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          {/* Logout Confirmation Modal */}
          {showLogoutConfirmation && (
            <Modal
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowLogoutConfirmation(false)}
            >
              <View style={styles.logoutModalOverlay}>
                <View style={styles.logoutModalContent}>
                  <Text style={styles.confirmationText}>
                    Do you want to log out your account?
                  </Text>
                  <View style={styles.confirmationButtons}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setShowLogoutConfirmation(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleLogout}>
                      <Text style={styles.confirmButtonText}>Yes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </Animated.View>
      </Modal>

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
                <View style={styles.displayContainer}>
                <Image
                    style={styles.display}
                    source={require("../../../assets/images/flashcard.png")}
                    />
                </View>
                <Text style={styles.modalHeader}> Enter Name for Your Deck:</Text>
                  <View style={styles.action}>
                  <TextInput
                      placeholder="Science, English, Math..."
                      style={styles.textInput}
                      value={deckTitle}
                      onChangeText={setDeckTitle}
                  />
                  </View>
                  <TouchableOpacity style={styles.modalOption} onPress={addDeck}>
                  <Ionicons name="albums-outline" size={20} color="#fff" />
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
    paddingHorizontal: 10,
    backgroundColor: '#3C096C',
    height: 100,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayContainer: {
    width: '100%',
    height: 150, // Set a height that accommodates the image
    alignItems: 'center',
    justifyContent: 'center',
  },  
  display: {
    height: 120,
    width: 120,
    resizeMode: 'contain', // Ensures the entire image fits within the bounds
  },  
  logo:{
    height: 18,
    width: 18,
    marginRight: 10,
    marginTop: 4,
  },
  logoText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
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
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader:{
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#5A189A'
  },
  modalOption: {
    flexDirection: 'row',
    backgroundColor: '#3C096C',
    padding: 10,
    marginVertical: 16,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  modalOptionText: { fontSize: 14, fontWeight: 'bold', color: '#fff', marginLeft: 4, },
  action: {
    flexDirection: 'row',
    marginTop: 16,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#420475',
    borderRadius: 4,
  },
  textInput: {
    flex: 1,
    color: '#05375a',
  },
  profileModalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  profileModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  profileModalContent: {
    width: 250,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  profileIcon: {
    marginBottom: -2, // Space between the icon and the text
  },
  profileText1: {
    fontSize: 20,
    marginBottom: 2,
    color: '#3C096C',
    fontWeight: 'bold',
  },
  profileText2: {
    fontSize: 14,
    marginBottom: 10,
    color: 'gray',
  },
  logoutButton: {
    backgroundColor: '#97233F', 
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },

  logoutText: {
    color: 'white', // White text for better contrast
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Styles for the confirmation modal
  logoutModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  logoutModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

});



export default TabLayout;