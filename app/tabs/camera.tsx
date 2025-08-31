import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { FlashMode } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Pressable, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // or Ionicons, FontAwesome, etc.
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import { db, storage } from './firebaseConfig'; // update if needed
import { useLocalSearchParams } from 'expo-router';
import { Buffer } from 'buffer';



export default function App() {
  
  const { eventId } = useLocalSearchParams();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [photo, setPhoto] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null); //This is where reference is weird, dont know if should use useState instead for camera
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();


  useEffect(() => {
    return () => {
      if (cameraRef.current) {
      }
    };
  }, [facing, flash]);

  const setCameraRef = (ref: CameraView | null) => { //Confused about reference to camera
    cameraRef.current = ref;
    setIsCameraReady(!!ref);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission?.granted || !mediaPermission?.granted) {
    return ( // Granting permission for camera, not sure if it works on android, have not been able to test it
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Camera Permission" />
        <Button onPress={requestMediaPermission} title="Grant Media Permission" />
      </View>
    );
  }

  function toggleCameraFacing() { //Toggling camera facing forward or back, dont touch
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function toggleCameraFlash() { //Toggling flash, dont touch
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  }

  const getFlashIconName = (mode: FlashMode) => {
    switch (mode) {
      case 'on':
        return 'flash';
      default:
        return 'flash-off';
    }
  };
  
  

  async function takePhoto() { //Need work on this function to take photo
    if (cameraRef.current && isCameraReady) {
      try {
        const photoData = await cameraRef.current.takePictureAsync();
        if (photoData?.uri) {
          setPhoto(photoData.uri);
          console.log(photoData.uri);
        } else {
          console.error("Photo capture failed: No URI");
        }
      } catch (error) {
        console.error("Error", error);
      }
    } else {
      console.warn("Camera is not ready or ref is null");
    }
  }

  function retakePhoto() {
    setPhoto(null);
  }

  

  
  async function uploadPhoto() {
    if (!photo || !eventId) {
      console.warn('No photo or event ID available');
      return;
    }
  
    try {
      const fileUri = photo;
      
      const response = await fetch(photo);
      const blob = await response.blob();
  
      const filename = `${Date.now()}.jpg`;
      const storageRef = ref(storage, `events/${eventId}/photos/${filename}`);
  
      const metadata = {
        contentType: 'image/jpeg',
      };
  
      await uploadBytes(storageRef, blob, metadata);
      const downloadURL = await getDownloadURL(storageRef);
  
      // Add reference to Firestore
      await addDoc(collection(db, 'events', eventId, 'photos'), {
        url: downloadURL,
        uploadedAt: serverTimestamp(),
      });
  
      console.log('Photo uploaded and saved!');
      setPhoto(null); // Clear preview or navigate to album
  
    } catch (err) {
      console.error('Upload error:', err);
    }
  }
  


  return (
    <View style={styles.container}>
      {photo ? ( //Allows for retaking, should be able to leave this alone
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <Pressable onPress={retakePhoto} style={styles.retakeButton}>
            <Text style={styles.text}>Retake</Text>
          </Pressable>
          <Pressable onPress={uploadPhoto} style={styles.uploadButton}>
            <Text style={styles.text}>Upload</Text>
          </Pressable>


        </View>
      ) : (
        <CameraView
          style={styles.container_cont}
          facing={facing}
          flash={flash}
          ref={setCameraRef} // This callback reference is not working, something to do with import CameraView, Camera is a class or something
          onCameraReady={() => {}}
        >
          <View style={styles.camera}>
            <Pressable onPress={toggleCameraFacing} style={styles.flipcamerabutton}>
              <Icon name="camera-switch" size={24} color="#fff" />
            </Pressable>

            <Pressable onPress={toggleCameraFlash} style={styles.flashcamerabutton}>
              <Icon name={getFlashIconName(flash)} size={24} color="#fff" />
            </Pressable>

            <Pressable onPress={takePhoto} style={styles.captureButton}>
              <Text style={styles.text}>Take Pic</Text>
            </Pressable>
          </View>
        </CameraView>
      )}
    </View>
  );
}
 
//Please delete some of these as we find necessary
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#386C5F',
  },
  flashcamerabutton: {
    backgroundColor: '#386C5F',
    borderRadius: 20,
    padding: 20,
    color: 'white',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  captureButton: {
    backgroundColor: '#386C5F',
    position: 'absolute',
    bottom: 30,
    padding: 20,
    borderRadius: 20,
    right: -70,
  },
  retakeButton: {
    position: 'absolute',
    bottom: 100,
    padding: 20,
    backgroundColor: '#386C5F',
    borderRadius: 20,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 30,
    padding: 20,
    backgroundColor: '#386C5F',
    borderRadius: 20,
    left: -70,
  },  
  previewContainer: {
    bottom: 20,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#386C5F',
    width: '100%',
    height: '80%',
  },
  preview: {
    borderRadius: 20,
    width: '100%',
    height: '80%',
    resizeMode: 'cover',
  },
  container_cont: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#386C5F',
    width: '100%',
    height: '80%',
    top: 65,
  },
  message: {
    borderRadius: 20,
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    borderRadius: 20,
    flex: 1,
  },
  flipcamerabutton: {
    backgroundColor: '#386C5F',
    borderRadius: 20,
    padding: 20,
    color: 'white',
    position: 'absolute',
    top: 20,
    left: 30,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});