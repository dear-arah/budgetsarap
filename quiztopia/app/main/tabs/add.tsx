import { View, Text, StyleSheet, Button, Modal } from 'react-native';
import { useState } from 'react';


export default function AddPage() {
  const [modalVisible, setModalVisible] = useState(false);


  return (
    <View style={styles.container}>
      <Button title="Open Modal" onPress={() => setModalVisible(true)} />
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text>Add New Folder</Text>
          <Text>Add New Deck</Text>
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5', // Light background color
  },
  modalContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
