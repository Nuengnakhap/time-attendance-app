import Button from "@components/Button";
import { MonoText } from "@components/StyledText";
import { AntDesign } from "@expo/vector-icons";
import { Camera, CameraCapturedPicture } from "expo-camera";
import * as Linking from "expo-linking";
import React, { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackScreenProps } from "types";

export default function CameraScreen({
  navigation,
  route,
}: RootStackScreenProps<"Camera">) {
  const { type, onSave } = route.params;

  const camera = useRef<Camera>(null);
  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture>();
  const [granted, setGranted] = useState<boolean | null>(null);

  useEffect(() => {
    const init = async () => {
      const permission = await Camera.requestCameraPermissionsAsync();
      setGranted(permission.granted);
    };

    init();
  }, []);

  const takePicture = async () => {
    const photo = await camera.current?.takePictureAsync({ quality: 0.8 });
    setCapturedImage(photo);
  };

  const savePicture = () => {
    onSave(capturedImage as CameraCapturedPicture);
    navigation.goBack();
  };

  const openSetting = () => {
    Linking.openSettings();
  };

  const closeCamera = () => {
    navigation.goBack();
  };

  if (granted === null) {
    return <View style={styles.screen} />;
  }

  if (granted === false) {
    <View style={[styles.screen, { paddingHorizontal: 24 }]}>
      <MonoText style={{ textAlign: "center", marginBottom: 10 }}>
        {
          "Permission to access camera was denied!\nPlease open setting for allow access camera."
        }
      </MonoText>
      <Button onPress={openSetting} text="Open Setting" />
    </View>;
  }

  return (
    <View style={styles.screen}>
      {!capturedImage ? (
        <Camera ref={camera} style={styles.camera} type={type}>
          <View style={styles.container}>
            <SafeAreaView style={styles.safe}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeCamera}
              >
                <AntDesign name="close" size={36} color="#fff" />
              </TouchableOpacity>
              <View style={styles.takeContainer}>
                <TouchableOpacity
                  onPress={takePicture}
                  style={styles.takeButton}
                >
                  <View style={styles.takeButtonInner} />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        </Camera>
      ) : (
        <ImageBackground
          style={styles.imageBg}
          source={{ uri: capturedImage.uri }}
        >
          <SafeAreaView style={styles.previewContainer}>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setCapturedImage(undefined)}
              >
                <MonoText style={styles.actionText}>Re-take</MonoText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={savePicture}
              >
                <MonoText style={styles.actionText}>Save</MonoText>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ImageBackground>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  camera: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  safe: {
    flexDirection: "column",
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  closeButton: { alignSelf: "flex-end" },
  takeContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 36,
    alignItems: "center",
  },
  takeButton: {
    width: 64,
    height: 64,
    backgroundColor: "transparent",
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  takeButtonInner: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 1000,
  },
  imageBg: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  actionRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  actionText: {
    color: "#fff",
    fontSize: 18,
  },
  actionButton: {
    paddingVertical: 10,
  },
});
