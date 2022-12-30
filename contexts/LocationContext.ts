import React from "react";

export type LocationType = {
  latitude: number;
  longitude: number;
};

export type CheckInZoneType = {
  latitude: number;
  longitude: number;
  radius: number;
};

export type HistoryType = {
  id: string;
  date: Date;
  selfie: string;
  place: string;
  latitude: number;
  longitude: number;
  deviceId: string;
  placeName: string;
};

export type LocationContext = {
  location?: LocationType;
  setLocation: React.Dispatch<React.SetStateAction<LocationType | undefined>>;
  errorMsg?: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string | undefined>>;
  getCurrent: () => Promise<void>;
  checkInZone: CheckInZoneType;
  setCheckInZone: React.Dispatch<React.SetStateAction<CheckInZoneType>>;
  draggable: boolean;
  setDraggable: React.Dispatch<React.SetStateAction<boolean>>;
};

const LocationContext = React.createContext({} as LocationContext);

export default LocationContext;
