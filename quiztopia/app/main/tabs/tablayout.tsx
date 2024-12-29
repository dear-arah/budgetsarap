import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './home'; // Import your home screen
import AddScreen from './add'; // Import your add screen
import ProgressScreen from './progress'; // Import your progress screen

function TabLayout() {
  const [currentTab, setCurrentTab] = useState('Home'); // Manage the current active tab

  // Render the appropriate screen based on the active tab
  const renderScreen = () => {
    switch (currentTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Add':
        return <AddScreen />;
      case 'Progress':
        return <ProgressScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Render the selected screen */}
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Custom Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentTab('Home')}
        >
          <Ionicons
            name="home-outline"
            size={24}
            color={currentTab === 'Home' ? '#FF9100' : '#8e8e93'}
          />
          <Text
            style={{
              color: currentTab === 'Home' ? '#FF9100' : '#8e8e93',
            }}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentTab('Add')}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={currentTab === 'Add' ? '#FF9100' : '#8e8e93'}
          />
          <Text
            style={{
              color: currentTab === 'Add' ? '#FF9100' : '#8e8e93',
            }}
          >
            Add
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setCurrentTab('Progress')}
        >
          <Ionicons
            name="stats-chart-outline"
            size={24}
            color={currentTab === 'Progress' ? '#FF9100' : '#8e8e93'}
          />
          <Text
            style={{
              color: currentTab === 'Progress' ? '#FF9100' : '#8e8e93',
            }}
          >
            Progress
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default TabLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 0,
    borderColor: '#ddd',
  },
  tabButton: {
    alignItems: 'center',
  },
});
