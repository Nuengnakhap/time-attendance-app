import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { MonoText } from "@components/StyledText";
import Button from "@components/Button";
import Input from "@components/Input";
import { CheckInZoneType } from "@contexts/LocationContext";
import useLocation from "@hooks/useLocation";

function isNumeric(str: string) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    // @ts-ignore
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

export default function SettingScreen() {
  const { checkInZone, setCheckInZone, draggable, setDraggable } =
    useLocation();

  const [hasEdit, setHasEdit] = useState(false);
  const [fromCheckIn, setFromCheckIn] = useState({
    latitude: checkInZone.latitude.toString(),
    longitude: checkInZone.longitude.toString(),
    radius: checkInZone.radius.toString(),
  });

  const onCancel = () => {
    setHasEdit(false);
    setFromCheckIn({
      latitude: checkInZone.latitude.toString(),
      longitude: checkInZone.longitude.toString(),
      radius: checkInZone.radius.toString(),
    });
  };

  const onSave = () => {
    if (!isNumeric(fromCheckIn.latitude)) {
      return Alert.alert("Check-In Zone Error", "Latitude allow only number!");
    }
    if (!isNumeric(fromCheckIn.longitude)) {
      return Alert.alert("Check-In Zone Error", "Longitude allow only number!");
    }
    if (!isNumeric(fromCheckIn.radius)) {
      return Alert.alert("Check-In Zone Error", "Radius allow only number!");
    }

    setCheckInZone({
      latitude: Number(fromCheckIn.latitude),
      longitude: Number(fromCheckIn.longitude),
      radius: Number(fromCheckIn.radius),
    });
    setHasEdit(false);
  };

  const onCheckInChange =
    (key: keyof typeof fromCheckIn) => (value: string) => {
      if (!hasEdit) setHasEdit(true);
      setFromCheckIn({ ...fromCheckIn, [key]: value });
    };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <MonoText bold style={styles.titleText}>
          Check-In Zone
        </MonoText>
        <View>
          <MonoText bold>Latitude</MonoText>
          <Input
            placeholder="Latitude"
            containerStyle={{ marginBottom: 5 }}
            value={fromCheckIn.latitude}
            keyboardType="numbers-and-punctuation"
            onChangeText={onCheckInChange("latitude")}
          />
        </View>
        <View>
          <MonoText bold>Longitude</MonoText>
          <Input
            placeholder="Longitude"
            containerStyle={{ marginBottom: 5 }}
            value={fromCheckIn.longitude}
            keyboardType="numbers-and-punctuation"
            onChangeText={onCheckInChange("longitude")}
          />
        </View>
        <View>
          <MonoText bold>Radius (meter)</MonoText>
          <Input
            placeholder="Radius"
            containerStyle={{ marginBottom: 10 }}
            value={fromCheckIn.radius}
            keyboardType="numbers-and-punctuation"
            onChangeText={onCheckInChange("radius")}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <MonoText bold style={styles.titleText}>
            Draggable Location
          </MonoText>
          <Switch
            trackColor={{
              false: "rgb(229, 229, 229)",
              true: "rgb(76, 217, 100)",
            }}
            thumbColor={"#fff"}
            onValueChange={setDraggable}
            value={draggable}
          />
        </View>
      </ScrollView>
      {hasEdit && (
        <View style={styles.footer}>
          <Button
            text="Cancel"
            type="secondary"
            style={styles.rowItemLeft}
            onPress={onCancel}
          />
          <Button text="Save" style={styles.rowItemRight} onPress={onSave} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexGrow: 1,
  },
  titleText: {
    fontSize: 16,
    marginBottom: 6,
  },
  footer: {
    padding: 10,
    flexDirection: "row",
  },
  row: {
    flexDirection: "row",
  },
  rowItemLeft: { flex: 1, marginRight: 5 },
  rowItemRight: { flex: 1, marginLeft: 5 },
});
