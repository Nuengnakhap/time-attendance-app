import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import firebase from "@configs/firebase";
import useDeviceId from "@hooks/useDevice";
import { RootTabScreenProps } from "types";
import dayjs from "dayjs";

type History = {
  id: string;
  date: string;
  selfie: string;
  place: string;
  latitude: number;
  longitude: number;
  deviceId: string;
  placeName: string;
};

export default function HistoryScreen({
  navigation,
}: RootTabScreenProps<"History">) {
  const deviceId = useDeviceId();

  const [histories, setHistories] = useState<Array<History>>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getHistory();
    const focus = navigation.addListener("focus", () => {
      getHistory();
    });

    return () => {
      focus();
    };
  }, [deviceId]);

  const getHistory = async () => {
    if (!deviceId) return;

    const q = query(
      collection(firebase.db, "time_attendance"),
      where("deviceId", "==", deviceId),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);
    const data: Array<History> = [];
    querySnapshot.forEach((doc) => {
      data.push({
        ...doc.data(),
        id: doc.id,
        date: dayjs(new Date(doc.data().date.seconds * 1000)).format(
          "DD/MM/YYYY HH:mm:ss"
        ),
      } as History);
    });

    setHistories(data);
    setRefreshing(false);
  };

  const onPressCard = (item: History) => {
    navigation.navigate("CheckInDetail", item);
  };

  const onRefresh = () => {
    setRefreshing(true);
    getHistory();
  };

  const renderItem: ListRenderItem<History> = ({ item }) => {
    return (
      <TouchableOpacity style={styles.card} onPress={() => onPressCard(item)}>
        <Image source={{ uri: item.selfie }} style={styles.cardImage} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 19, paddingVertical: 11 }}
        data={histories}
        keyExtractor={(e) => e.id}
        renderItem={renderItem}
        numColumns={2}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  card: {
    borderRadius: 10,
    overflow: "hidden",
    height: 200,
    flex: 1 / 2,
    margin: 5,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
});
