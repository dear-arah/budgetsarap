 {/*import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

export default function folderscreen({ route, navigation }) {
    const [folderName, setFolderName] = useState(route.params?.isNew ? 'New Folder' : 'Folder Name');
    const [items, setItems] = useState([]); // Stores subfolders and decks
  
    const addFolder = () => {
      setItems([...items, { type: 'folder', name: `Folder ${items.length + 1}` }]);
    };
  
    const addDeck = () => {
      setItems([...items, { type: 'deck', name: `Deck ${items.length + 1}` }]);
    };
  
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.titleInput}
          value={folderName}
          onChangeText={setFolderName}
          placeholder="Enter Folder Name"
        />
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                item.type === 'folder'
                  ? navigation.navigate('Folder', { isNew: false }) // Open subfolder
                  : navigation.navigate('Deck') // Open deck
              }
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    titleInput: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    item: { padding: 15, backgroundColor: '#f0f0f0', marginVertical: 5 },
    buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    button: { padding: 10, backgroundColor: '#ddd', borderRadius: 5 },
  }); */}