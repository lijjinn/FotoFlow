import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useLocalSearchParams } from 'expo-router';

type PhotoItem = {
  id: string;
  url: string;
  uploadedAt?: any;
};

export default function AlbumScreen() {
  const route = useRoute();
  const { eventId } = useLocalSearchParams();

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = async () => {
    try {
      const photosRef = collection(db, 'events', eventId, 'photos');
      const q = query(photosRef, orderBy('uploadedAt', 'desc'));
      const snapshot = await getDocs(q);
      const photoData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PhotoItem));
      setPhotos(photoData);
    } catch (err) {
      console.error('Error fetching photos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Event Album</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading photos...</Text>
      ) : photos.length === 0 ? (
        <Text style={styles.loadingText}>No photos yet.</Text>
      ) : (
        <FlatList
          data={photos}
          numColumns={2}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item.url }}
              style={styles.photo}
              resizeMode="cover"
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#386C5F',
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  title: {
    color: '#FFFBCE',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loadingText: {
    color: '#FFFBCE',
    fontSize: 16,
    marginTop: 20,
  },
  grid: {
    gap: 10,
    paddingBottom: 20,
  },
  photo: {
    width: 160,
    height: 160,
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#ffffff33',
  },
});
