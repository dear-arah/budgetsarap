import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ProgressPage() {
  const [totalDecksCreated, setTotalDecksCreated] = useState(0);
  const [flashcardsStudied, setFlashcardsStudied] = useState(0);
  const [quizHistory, setQuizHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('history'); // Tabs: 'summary' or 'history'
  const [selectedDate, setSelectedDate] = useState(new Date()); // Current selected date

  useEffect(() => {
    const fetchProgress = async () => {
      const decksCreated = await AsyncStorage.getItem('totalDecksCreated');
      const studiedCards = await AsyncStorage.getItem('flashcardsStudied');
      const history = await AsyncStorage.getItem('quizHistory');
  
      setTotalDecksCreated(decksCreated ? parseInt(decksCreated, 10) : 0);
      setFlashcardsStudied(studiedCards ? new Set(JSON.parse(studiedCards)).size : 0);
      setQuizHistory(history ? JSON.parse(history) : []);
    };
    fetchProgress();
  }, []);  // Only run on mount

  const renderQuizHistory = ({ item }) => {
    console.log(item); // Log the item to inspect its contents
    return (
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>{item?.deckTitle ? item.deckTitle : 'N/A'}</Text>
        <Text style={styles.tableCell}>{item?.quizType ? item.quizType : 'N/A'}</Text>
        <Text style={styles.tableCell}>{item?.date ? item.date : 'N/A'}</Text>
        <Text style={styles.tableCell}>{item?.score ? item.score : 'N/A'}</Text>
      </View>
    );
  };

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const handleDayNavigation = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  const renderCalendar = () => {
    const currentYear = selectedDate.getFullYear();
    const currentMonth = selectedDate.getMonth();
    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    const currentDay = isCurrentMonth ? today.getDate() : null;
  
    const daysInMonthArray = Array.from({ length: daysInMonth(currentYear, currentMonth) }, (_, i) => i + 1);
    const dayNames = ['S', 'M', 'T', 'W', 'Th', 'F', 'S'];
  
    const getCenteredDays = () => {
      const totalDays = daysInMonthArray.length;
      const centerDay = selectedDate.getDate();
      const visibleDays = 7;
      let start = Math.max(0, centerDay - Math.ceil(visibleDays / 2));
      if (start + visibleDays > totalDays) {
        start = totalDays - visibleDays;
      }
      return daysInMonthArray.slice(start, start + visibleDays);
    };
  
    const centeredDays = getCenteredDays();
  
    return (
      <View style={styles.calendarContainer}>
        {/* Top Row: Month and Year */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => handleDayNavigation(-1)}>
            <Text style={styles.calendarNavButton}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.calendarTitle}>
            {selectedDate.toLocaleString('default', { month: 'long' })} {currentYear}
          </Text>
          <TouchableOpacity onPress={() => handleDayNavigation(1)}>
            <Text style={styles.calendarNavButton}>{'>'}</Text>
          </TouchableOpacity>
        </View>
  
        {/* Day Names and Numbers */}
        <View style={styles.calendarDaysContainer}>
          {centeredDays.map((day, index) => {
            const dayIndex = (new Date(currentYear, currentMonth, day).getDay() + 6) % 7; // Align to "S" = 0
            const isSelected = day === selectedDate.getDate();
            const isToday = isCurrentMonth && day === currentDay;
  
            // Set opacity based on position
            let opacity = 1;
            if (index === 0 || index === centeredDays.length - 1) opacity = 0.5;
            if (index === 1 || index === centeredDays.length - 2) opacity = 0.7;
  
            return (
              <View key={day} style={[styles.calendarDayContainer, { opacity }]}>
                <Text style={styles.calendarDayName}>{dayNames[dayIndex]}</Text>
                <TouchableOpacity
                  onPress={() => setSelectedDate(new Date(currentYear, currentMonth, day))}
                  style={[
                    styles.calendarDay,
                    isToday && styles.currentDayHighlight,
                    isSelected && styles.selectedDayHighlight,
                  ]}
                >
                  <Text
                    style={[
                      styles.calendarDayText,
                      isToday && styles.currentDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      {/* Top Rows */}
      <View style={styles.topRow}>
        <View style={styles.card}>
          <Text style={styles.label}>Total Decks Created:</Text>
          <Text style={styles.value}>
            {totalDecksCreated ? totalDecksCreated.toString() : 'N/A'}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Total Flashcards Studied:</Text>
          <Text style={styles.value}>
            {flashcardsStudied ? flashcardsStudied.toString() : 'N/A'}
          </Text>
        </View>
      </View>

      {/* Calendar */}
      {renderCalendar()}

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'history' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={styles.tabText}>Quiz History</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'history' && (
        <>
          <FlatList
            data={quizHistory}
            renderItem={renderQuizHistory}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={
              <View style={styles.tableHeader}>
                <Text style={styles.tableCell}>Deck Name</Text>
                <Text style={styles.tableCell}>Quiz Type</Text>
                <Text style={styles.tableCell}>Date</Text>
                <Text style={styles.tableCell}>Score</Text>
              </View>
            }
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </>
      )}
    </View>
  );
}

export default ProgressPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 14,
  },
  card: {
    width: '45%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 100,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#240046',
    textAlign: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5A189A',
    textAlign: 'center',
  },
  tabs: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',

  },
  tabButton: {
    width: 100,
    height: 30,
    padding: 6,
    alignItems: 'center',
    backgroundColor: '#ddd',
    marginHorizontal: 5,
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: '#3C096C',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 6,
    borderBottomWidth: 1,
    borderColor: 'transparent',
    elevation: 3,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    color: '#240046',
    paddingHorizontal: 5,
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: '#FF5A5F',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  calendarContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
    borderBottomColor: "f5f5f5",
  },
  calendarNavButton: {
    fontSize: 25,
    color: '#5A189A',
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#240046',
  },
  calendarDayNamesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  calendarDayNameContainer: {
    alignItems: 'center',
    width: 40,
  },
  calendarDayName: {
    fontSize: 12,
    color: 'gray',
  },
  calendarDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Prevent scrolling
  },
  calendarDayContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  calendarDay: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20, // Make the day background circular
  },
  calendarDayText: {
    fontSize: 14,
    color: '#240046',
  },
  currentDayHighlight: {
    backgroundColor: '#5A189A',
    borderRadius: 20,
  },
  selectedDayHighlight: {
    borderColor: '#5A189A',
    borderWidth: 1,
  },
  currentDayText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  leftFade: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 20,
    zIndex: 10,
  },
  rightFade: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 20,
    zIndex: 10,
  },
});
