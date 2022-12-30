import Button from "@components/Button";
import { MonoText } from "@components/StyledText";
import useLocation from "@hooks/useLocation";
import * as Linking from "expo-linking";
import haversine from "haversine-distance";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, {
  Circle,
  Marker,
  MarkerDragStartEndEvent,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import tinycolor from "tinycolor2";
import { RootTabScreenProps } from "types";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import firebase from "@configs/firebase";
import useDeviceId from "@hooks/useDevice";
import { HistoryType } from "@contexts/LocationContext";
import dayjs from "dayjs";

export default function CheckInScreen({
  navigation,
}: RootTabScreenProps<"CheckIn">) {
  const { location, error, setLocation, checkInZone, draggable } =
    useLocation();
  const deviceId = useDeviceId();

  const [canCheckInToday, setCanCheckInToday] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLastCheckIn = async () => {
      try {
        const q = query(
          collection(firebase.db, "time_attendance"),
          where("deviceId", "==", deviceId),
          orderBy("date", "desc"),
          limit(1)
        );

        const querySnapshot = await getDocs(q);
        let data: HistoryType | undefined;
        querySnapshot.forEach((doc) => {
          data = {
            ...doc.data(),
            id: doc.id,
            date: new Date(doc.data().date.seconds * 1000),
          } as HistoryType;
        });

        let same = false;
        if (data) {
          same = dayjs().isSame(dayjs(data.date), "day");
        }
        setCanCheckInToday(!same);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    if (deviceId) {
      checkLastCheckIn();
    }
    const focus = navigation.addListener("focus", () => {
      if (deviceId) {
        checkLastCheckIn();
      }
    });

    return () => {
      focus();
    };
  }, [deviceId]);

  const distanceToWork = useMemo(() => {
    let distance = 0;
    if (location) {
      distance = haversine(location, checkInZone);
    }
    return distance;
  }, [location]);

  const canCheckIn = distanceToWork <= checkInZone.radius;

  const onDragEnd = (e: MarkerDragStartEndEvent) => {
    setLocation(e.nativeEvent.coordinate);
  };

  const openSetting = () => {
    Linking.openSettings();
  };

  return (
    <View style={styles.screen}>
      {location ? (
        <>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            <Circle
              center={checkInZone}
              radius={checkInZone.radius}
              fillColor={tinycolor(
                canCheckIn ? "rgb(0, 255, 0)" : "rgb(255, 0, 0)"
              )
                .setAlpha(0.7)
                .toString()}
              strokeColor="rgba(255, 255, 255, 0)"
              zIndex={-1}
              strokeWidth={0}
            />
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={"Current Location"}
              draggable={draggable}
              onDragEnd={onDragEnd}
            />
          </MapView>
          <View style={styles.button}>
            <Button
              text="Check-In"
              disabled={!canCheckIn || !canCheckInToday}
              loading={loading}
              onPress={() => navigation.navigate("CheckInFrom", location)}
            />
          </View>
        </>
      ) : (
        <View style={styles.errorView}>
          <MonoText style={styles.errorTitle}>Can't load Google Maps</MonoText>
          <MonoText style={styles.errorDesc}>{error}</MonoText>
          <Button
            text="Open Setting"
            onPress={openSetting}
            style={styles.errorButton}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  button: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  errorView: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  errorTitle: {
    textAlign: "center",
    fontSize: 24,
  },
  errorDesc: {
    marginTop: 10,
    textAlign: "center",
  },
  errorButton: { width: "50%", alignSelf: "center", marginTop: 10 },
});
