// StudentCards.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Client, Databases } from 'appwrite';
import { Card, Title, Paragraph, Button, Provider as PaperProvider } from 'react-native-paper';

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1').setProject('67dd8453002a601838ad');

const databases = new Databases(client);
const databaseId = '67dd8a42000b2f5184aa';
const collectionId = 'Students';

const StudentCards = ({ navigation }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await databases.listDocuments(databaseId, collectionId);
      const formatted = response.documents.map((doc) => ({
        id: doc.$id,
        first_name: doc.first_name,
        last_name: doc.last_name,
        index_number: doc.index_number
      }));
      setStudents(formatted);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      Alert.alert('Error', 'Could not load student data');
    }
  };

  const handleAddMarks = (student) => {
    navigation.navigate('PresentationMarks', { student });
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.first_name} {item.last_name}</Title>
        <Paragraph>Index No: {item.index_number}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => handleAddMarks(item)}>
          Add Marks
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F2F2F2'
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3
  }
});

export default StudentCards;
