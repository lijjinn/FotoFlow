import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from './firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';


type EventItem = {
  id: string;
  name: string;
  description: string;
  members: string[];
};

export default function EventsScreen() {
  const navigation = useNavigation();
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [events, setEvents] = useState<EventItem[]>([]);
  const user = auth.currentUser;
  const [loadingAuth, setLoadingAuth] = useState(true);


  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'events'));
      const eventsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as EventItem));
      setEvents(eventsData);
    } catch (error) {
      if (error instanceof Error) console.error('Fetch error:', error.message);
    }
  };

  const createEvent = async () => {
    if (!eventName.trim()) return setStatus('Please enter an event name.');
    if (!user) return setStatus('You must be signed in.');

    try {
      await addDoc(collection(db, 'events'), {
        name: eventName,
        description,
        creator: user.uid,
        createdAt: serverTimestamp(),
        members: [user.uid],
      });

      setEventName('');
      setDescription('');
      setStatus('✅ Event created!');
      fetchEvents();
    } catch (error) {
      if (error instanceof Error) setStatus(`Error: ${error.message}`);
    }
  };

  const toggleJoin = async (eventId: string, currentMembers: string[]) => {
    if (!user) return;

    const isMember = currentMembers.includes(user.uid);
    const updatedMembers = isMember
      ? currentMembers.filter(id => id !== user.uid)
      : [...currentMembers, user.uid];

    try {
      await updateDoc(doc(db, 'events', eventId), {
        members: updatedMembers,
      });
      fetchEvents();
    } catch (error) {
      if (error instanceof Error) console.error('Join/Leave error:', error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchEvents();
      }
      setLoadingAuth(false); // stop showing loading regardless of auth state
    });
  
    return () => unsubscribe();
  }, []);
  
  if (loadingAuth) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <Text style={{ color: '#FFFBCE', fontSize: 20 }}>Signing in...</Text>
      </SafeAreaView>
    );
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Create Event</Text>
      <TextInput
        placeholder="Event Name"
        placeholderTextColor="#ccc"
        value={eventName}
        onChangeText={setEventName}
        style={styles.input}
      />
      <TextInput
        placeholder="Description (optional)"
        placeholderTextColor="#ccc"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button title="Create" color="#fff" onPress={createEvent} />
      </View>
      {status ? <Text style={styles.status}>{status}</Text> : null}

      <Text style={styles.header}>All Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }: { item: EventItem }) => {
          const isMember = item.members.includes(user?.uid ?? '');
          return (
            <View style={styles.eventCard}>
              <Text style={styles.eventText}>{item.name}</Text>
              <Text style={styles.eventSub}>{item.description}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.customButton, { backgroundColor: isMember ? '#8B3A3A' : '#06402B' }]}
                  onPress={() => toggleJoin(item.id, item.members || [])}
                >
                  <Text style={styles.buttonText}>{isMember ? 'Leave' : 'Join'}</Text>
                </TouchableOpacity>
                {isMember && (
                  <TouchableOpacity onPress={() => navigation.navigate('camera', { eventId: item.id })}>
                  <Text style={{ color: 'white' }}>Open Camera</Text>
                </TouchableOpacity>
                )}
                {isMember && (
                  <TouchableOpacity
                    style={[styles.customButton, { backgroundColor: '#2E8B57' }]}
                    onPress={() => navigation.navigate('events/album', { eventId: item.id })}
                  >
                    <Text style={styles.buttonText}>View Album</Text>
                  </TouchableOpacity>
                )}
              </View>

            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#386C5F',
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFBCE',
    marginVertical: 10,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    backgroundColor: '#ffffff22',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    color: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    width: '80%',
    backgroundColor: '#ffffff33',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  status: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  eventCard: {
    width: 350,
    backgroundColor: '#ffffff22',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  eventText: {
    color: '#FFFBCE',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventSub: {
    color: '#eee',
    fontSize: 14,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  customButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  buttonText: {
    color: '#FFFBCE',
    fontSize: 16,
    fontWeight: '600',
  },
  
  }
);
