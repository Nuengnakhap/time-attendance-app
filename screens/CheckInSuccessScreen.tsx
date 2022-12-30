import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MonoText } from "@components/StyledText";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Button from "@components/Button";
import { RootStackScreenProps } from "types";

export default function CheckInSuccessScreen({
  navigation,
}: RootStackScreenProps<"CheckInSuccess">) {
  return (
    <SafeAreaView style={styles.screen}>
      <Feather name="check-circle" size={80} color="#00ff00" />
      <MonoText bold style={styles.text}>
        Check-In Success!
      </MonoText>
      <Button
        text="Back"
        style={{ width: "50%" }}
        onPress={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  text: { marginVertical: 10, fontSize: 24 },
});
