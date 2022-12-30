import React, { useEffect, useState } from "react";
import * as Application from "expo-application";
import { Platform } from "react-native";

export default function useDeviceId() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  useEffect(() => {
    const init = async () => {
      if (Platform.OS == "android") {
        setDeviceId(Application.androidId);
      } else {
        const id = await Application.getIosIdForVendorAsync();
        setDeviceId(id);
      }
    };

    init();
  }, []);

  return deviceId;
}
