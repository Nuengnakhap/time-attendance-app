import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import { MonoText } from "./StyledText";
import { useNavigation } from "@react-navigation/core";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

type CameraShotProps = {
  type: CameraType;
  onClose: () => void;
  onSave: (value: CameraCapturedPicture) => void;
};

export default function CameraShot({ type, onClose, onSave }: CameraShotProps) {
  const navigation = useNavigation();
  const camera = useRef<Camera>(null);
  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture>();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });

    return () => {
      navigation.setOptions({ headerShown: true });
    };
  }, []);

  const takePicture = async () => {
    const photo = await camera.current?.takePictureAsync({ quality: 0.8 });
    setCapturedImage(photo);
  };

  const savePicture = () => {
    onSave(capturedImage as CameraCapturedPicture);
  };

  return (
    <View style={styles.screen}>
      {!capturedImage ? (
        <Camera ref={camera} style={styles.camera} type={type}>
          <View style={styles.container}>
            <SafeAreaView style={styles.safe}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <AntDesign name="close" size={36} color="#fff" />
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <MonoText style={styles.text}>Flip Camera</MonoText>
            </TouchableOpacity> */}
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
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
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
