import { useContext } from "react";

import LocationContext from "@contexts/LocationContext";

export default function useLocation() {
  const {
    location,
    setLocation,
    errorMsg,
    getCurrent,
    checkInZone,
    setCheckInZone,
    draggable,
    setDraggable,
  } = useContext(LocationContext);

  return {
    getCurrent,
    location,
    error: errorMsg,
    setLocation,
    checkInZone,
    setCheckInZone,
    draggable,
    setDraggable,
  };
}
