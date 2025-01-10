import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

export default function DeckScreen({ route }) {
    const { title } = route.params;
    const [cards, setCards] = useState([]);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

   useEffect(() => {
    axios.post('http://192.168.1.9:3000/api/decks/add-deck', { title })
        .then(response => {
            console.log(response.data);
            // Fetch deck's flashcards after creating the deck
            axios.get(`http://192.168.1.9:3000/api/decks/${response.data.deck._id}`)
                .then(res => setCards(res.data.flashcards))
                .catch(err => console.log(err));
        })
        .catch(error => console.log(error));
}, []);

const deleteCard = async (index, cardId) => {
    try {
        await axios.delete(`http://192.168.1.9:3000/api/decks/delete-card`, {
            data: { deckId: title, cardId }
        });
        setCards(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
        console.log('Error deleting card:', error);
    }
};

const editCard = async (index, cardId, updatedQuestion, updatedAnswer) => {
    try {
        const res = await axios.put('http://192.168.1.9:3000/api/decks/edit-card', {
            deckId: title,
            cardId,
            question: updatedQuestion,
            answer: updatedAnswer
        });
        const updatedCards = [...cards];
        updatedCards[index] = res.data.updatedCard;
        setCards(updatedCards);
    } catch (error) {
        console.log('Error editing card:', error);
    }
};


    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <FlatList
                data={cards}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text>Q: {item.question}</Text>
                        <Text>A: {item.answer}</Text>
                    </View>
                )}
            />
            <TextInput
                placeholder="Enter Question"
                value={question}
                onChangeText={setQuestion}
                style={styles.input}
            />
            <TextInput
                placeholder="Enter Answer"
                value={answer}
                onChangeText={setAnswer}
                style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={addCard}>
                <Text>Add Card</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginVertical: 10 },
    button: { padding: 10, backgroundColor: '#ddd', borderRadius: 5, alignItems: 'center' },
    card: { padding: 10, backgroundColor: '#f0f0f0', marginVertical: 5 },
});
