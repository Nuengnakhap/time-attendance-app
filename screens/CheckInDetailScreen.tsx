import { MonoText } from "@components/StyledText";
import { StatusBar } from "expo-status-bar";
import { Image, Platform, ScrollView, StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "types";

export default function CheckInDetailScreen({
  route,
}: RootStackScreenProps<"CheckInDetail">) {
  const { date, placeName, selfie, place, latitude, longitude } = route.params;
  return (
    <View style={styles.container}>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingVertical: 16,
        }}
      >
        <MonoText bold style={styles.titleText}>
          Check-In Time
        </MonoText>
        <View style={styles.textBox}>
          <MonoText>{date}</MonoText>
        </View>
        <MonoText bold style={styles.titleText}>
          Place
        </MonoText>
        <View style={styles.textBox}>
          <MonoText>{placeName}</MonoText>
        </View>
        <MonoText bold style={styles.titleText}>
          Latitude, Longitude
        </MonoText>
        <View style={styles.textBox}>
          <MonoText>
            {latitude}, {longitude}
          </MonoText>
        </View>
        <MonoText bold style={styles.titleText}>
          Selfie Image
        </MonoText>
        <Image style={styles.previewImage} source={{ uri: selfie }} />
        <MonoText bold style={styles.titleText}>
          Surround Image
        </MonoText>
        <Image style={styles.previewImage} source={{ uri: place }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  titleText: {
    fontSize: 16,
    marginBottom: 6,
  },
  textBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    padding: 14,
    marginBottom: 10,
  },
  previewImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
});
