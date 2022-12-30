import React, { useEffect, useRef, useState } from "react";
import LocationContext, {
  CheckInZoneType,
  LocationType,
} from "@contexts/LocationContext";
import * as Location from "expo-location";
import { AppState } from "react-native";

export default function LocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const appState = useRef(AppState.currentState);

  const [checkInZone, setCheckInZone] = useState<CheckInZoneType>({
    latitude: 13.7455956,
    longitude: 100.5374222,
    radius: 500,
  });
  const [location, setLocation] = useState<LocationType>();
  const [errorMsg, setErrorMsg] = useState<string>();
  const [draggable, setDraggable] = useState(false);

  const getCurrent = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setLocation(undefined);
      setErrorMsg(
        "Permission to access location was denied!\nPlease open setting for allow access location."
      );
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
  };

  useEffect(() => {
    getCurrent();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // "App has come to the foreground!"
        getCurrent();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        errorMsg,
        setErrorMsg,
        getCurrent,
        checkInZone,
        setCheckInZone,
        draggable,
        setDraggable,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}
