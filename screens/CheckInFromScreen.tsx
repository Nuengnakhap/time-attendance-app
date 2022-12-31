import Button from "@components/Button";
import { MonoText } from "@components/StyledText";
import firebase from "@configs/firebase";
import { FontAwesome } from "@expo/vector-icons";
import useDeviceId from "@hooks/useDevice";
import useLocation from "@hooks/useLocation";
import axios from "axios";
import dayjs from "dayjs";
import { CameraCapturedPicture, CameraType } from "expo-camera";
import Constants from "expo-constants";
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
  const [submitting, setSubmitting] = useState(false);
  const [placeName, setPlaceName] = useState("");

  useEffect(() => {
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
  }, []);

  const setFormData = (key: keyof From) => (value: From[keyof From]) => {
    setFrom({ ...from, [key]: value });
  };

  const onSavePicture = (step: number) => (value: CameraCapturedPicture) => {
    setFormData(steps[step])(value.uri);
  };

  const onEditPicture = (key: keyof From) => {
    if (key == "selfie") {
      navigation.navigate("Camera", {
        type: CameraType.front,
        onSave: onSavePicture(0),
      });
    } else if (key == "place") {
      navigation.navigate("Camera", {
        type: CameraType.back,
        onSave: onSavePicture(1),
      });
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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.screen}>
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
        <ImageEdit uri={from.selfie} onPress={() => onEditPicture("selfie")} />
        <MonoText bold style={styles.titleText}>
          Surround Image
        </MonoText>
        <ImageEdit uri={from.place} onPress={() => onEditPicture("place")} />
      </ScrollView>
      <Button
        text="Submit"
        onPress={onSubmit}
        loading={submitting}
        disabled={!from.selfie || !from.place}
      />
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
    flexGrow: 1,
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
