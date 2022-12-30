import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { MonoText } from "./StyledText";

type InputProps = TextInputProps & {
  containerStyle?: ViewStyle;
};

export default function Input({ containerStyle, style, ...props }: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="rgba(0,0,0,0.5)"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,

    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  left: {
    marginRight: 8,
  },
  input: {
    paddingVertical: 10,
    flex: 1,
    fontFamily: "space-mono",
    color: "#000",
  },
});
