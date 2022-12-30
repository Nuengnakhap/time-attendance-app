import Button from "@components/Button";
import CameraShot from "@components/CameraShot";
import { MonoText } from "@components/StyledText";
import firebase from "@configs/firebase";
import { FontAwesome } from "@expo/vector-icons";
import useDeviceId from "@hooks/useDevice";
import axios from "axios";
import dayjs from "dayjs";
import {
  Camera,
  CameraCapturedPicture,
  CameraType,
  PermissionResponse,
} from "expo-camera";
import * as Linking from "expo-linking";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import tinycolor from "tinycolor2";
import { RootStackScreenProps } from "types";
import Constants from "expo-constants";
import useLocation from "@hooks/useLocation";

type From = {
  selfie: string;
  place: string;
};

const steps: Array<keyof From> = ["selfie", "place"];

export default function CheckInFromScreen({
  navigation,
  route,
}: RootStackScreenProps<"CheckInFrom">) {
  const { latitude, longitude } = route.params;
  const { checkInZone } = useLocation();
  const deviceId = useDeviceId();

  const date = useRef<Date>();

  const [from, setFrom] = useState<From>({ selfie: "", place: "" });
  const [step, setStep] = useState(0);
  const [guiding, setGuiding] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<PermissionResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [placeName, setPlaceName] = useState("");

  useEffect(() => {
    const init = async () => {
      const permission = await Camera.requestCameraPermissionsAsync();
      setPermission(permission);
      setIsOpen(true);

      axios
        .get("https://maps.googleapis.com/maps/api/geocode/json", {
          params: {
            latlng: latitude + "," + longitude,
            key: Constants.expoConfig?.extra?.mapsApiKey,
          },
        })
        .then(({ data }) => {
          setPlaceName(data.results[0]?.formatted_address ?? "");
        })
        .catch(() => {});
    };

    init();
  }, []);

  const openSetting = () => {
    Linking.openSettings();
  };

  const setFormData = (key: keyof From) => (value: From[keyof From]) => {
    setFrom({ ...from, [key]: value });
  };

  const onCloseCamera = () => {
    setIsOpen(false);
    setGuiding(false);
  };

  const onSavePicture = (value: CameraCapturedPicture) => {
    setIsOpen(false);
    setFormData(steps[step])(value.uri);
    if (step == 0 && guiding) {
      setStep(1);
      setIsOpen(true);
      setGuiding(false);
    }
  };

  const onEditPicture = (key: keyof From) => {
    if (key == "selfie") {
      setStep(0);
      setIsOpen(true);
    } else if (key == "place") {
      setStep(1);
      setIsOpen(true);
    }
  };

  const uploadImageAsync = async (name: string, uri: string) => {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(uri);
      const blob = await response.blob();

      const path = `${deviceId}/${name}-${new Date().getTime()}.jpg`;
      const fileRef = ref(firebase.storage, path);

      const uploadTask = uploadBytesResumable(fileRef, blob);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              reject("User doesn't have permission to access the object");
              break;
            case "storage/canceled":
              reject("User canceled the upload");
              break;
            case "storage/unknown":
              reject("Unknown error occurred, inspect error.serverResponse");
              break;
          }
        },
        async () => {
          const result = await getDownloadURL(fileRef);
          resolve(result);
        }
      );
    });
  };

  const onSubmit = async () => {
    setSubmitting(true);

    try {
      const [selfie, place] = await Promise.all([
        uploadImageAsync("selfie", from.selfie),
        uploadImageAsync("place", from.place),
      ]);

      await addDoc(collection(firebase.db, "time_attendance"), {
        date: Timestamp.fromDate(date.current as Date),
        selfie,
        place,
        latitude,
        longitude,
        deviceId,
        placeName,
        checkInZone,
      });

      navigation.replace("CheckInSuccess");
    } catch (error) {
      console.log(error);
      Alert.alert("Submit Error", JSON.stringify(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={[styles.screen, { paddingHorizontal: 24 }]}>
        <MonoText style={{ textAlign: "center", marginBottom: 10 }}>
          {
            "Permission to access camera was denied!\nPlease open setting for allow access camera."
          }
        </MonoText>
        <Button onPress={openSetting} text="Open Setting" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {isOpen ? (
        <CameraShot
          key={step}
          type={step == 0 ? CameraType.front : CameraType.back}
          onClose={onCloseCamera}
          onSave={onSavePicture}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <MonoText bold style={styles.titleText}>
              Current Time
            </MonoText>
            <TimeInterval onInterval={(e) => (date.current = e)} />
            <MonoText bold style={styles.titleText}>
              Place
            </MonoText>
            <View style={styles.textBox}>
              <MonoText>{placeName}</MonoText>
            </View>
            <MonoText bold style={styles.titleText}>
              Selfie Image
            </MonoText>
            <ImageEdit
              uri={from.selfie}
              onPress={() => onEditPicture("selfie")}
            />
            <MonoText bold style={styles.titleText}>
              Surround Image
            </MonoText>
            <ImageEdit
              uri={from.place}
              onPress={() => onEditPicture("place")}
            />
          </ScrollView>
          <Button
            text="Submit"
            onPress={onSubmit}
            loading={submitting}
            disabled={!from.selfie || !from.place}
          />
        </View>
      )}
    </View>
  );
}

function ImageEdit({ uri, onPress }: { uri?: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.previewContainer}>
        <Image
          style={styles.previewImage}
          source={uri ? { uri: uri } : undefined}
        />
        <View style={styles.previewOverlay}>
          <FontAwesome name="edit" size={30} color="white" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function TimeInterval({ onInterval }: { onInterval?: (date: Date) => void }) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const tmp = new Date();
      setDate(tmp);
      onInterval?.(tmp);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.textBox}>
      <MonoText style={{ textAlign: "center" }}>
        {dayjs(date).format("DD/MM/YYYY HH:mm:ss")}
      </MonoText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  titleRow: { flexDirection: "row", justifyContent: "space-between" },
  titleText: {
    fontSize: 16,
    marginBottom: 6,
  },
  previewContainer: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: tinycolor("#000").setAlpha(0.3).toString(),
    justifyContent: "center",
    alignItems: "center",
  },
  textBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    padding: 14,
    marginBottom: 10,
  },
});
