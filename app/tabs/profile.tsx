import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, SafeAreaView } from 'react-native';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(auth.currentUser);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setUser(auth.currentUser);
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUser(auth.currentUser);
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user ? (
        <>
          <Text style={styles.title}>Signed in as:</Text>
          <Text style={styles.text}>{user.email}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Sign Out" color="#FFFBCE" onPress={handleSignOut} />
          </View>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email or Phone Number"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <Button title="Sign In" color="#fFFFBCE" onPress={handleSignIn} />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Sign Up" color="#FFFBCE" onPress={handleSignUp} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#386C5F',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    backgroundColor: '#ffffff22',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: '90%',
    color: '#FFFBCE',
    fontSize: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFBCE',
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    color: '#FFFBCE',
    marginBottom: 20,
  },
  buttonContainer: {
    backgroundColor: '#ffffff33',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 8,
    width: '30%',
  },
});
