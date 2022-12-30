/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CheckInFromScreen from "@screens/CheckInFromScreen";
import CheckInScreen from "@screens/CheckInScreen";
import CheckInSuccessScreen from "@screens/CheckInSuccessScreen";
import HistoryScreen from "@screens/HistoryScreen";
import CheckInDetailScreen from "@screens/CheckInDetailScreen";
import SettingScreen from "@screens/SettingScreen";

import * as React from "react";
import { ColorSchemeName } from "react-native";

import Colors from "../constants/Colors";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({}: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CheckInFrom"
        component={CheckInFromScreen}
        options={{ gestureEnabled: false, title: "Check-In From" }}
      />
      <Stack.Screen
        name="CheckInSuccess"
        component={CheckInSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="CheckInDetail"
          component={CheckInDetailScreen}
          options={{ title: "Check-In Detail" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="CheckIn"
      screenOptions={{ tabBarActiveTintColor: Colors.primary }}
    >
      <BottomTab.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={({ navigation }: RootTabScreenProps<"CheckIn">) => ({
          title: "Check-In",
          tabBarIcon: ({ color }) => <TabBarIcon name="map-o" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="history" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          title: "Setting",
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}
