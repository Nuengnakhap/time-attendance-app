import colors from "@constants/Colors";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type ButtonProps = TouchableOpacityProps & {
  text: string;
  loading?: boolean;
  type?: "primary" | "secondary";
};

export default function Button({
  style,
  text,
  disabled,
  loading,
  type = "primary",
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles[type],
        (disabled || loading) && { backgroundColor: "#D3D3D3" },
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Text style={[styles.text, type == "secondary" && { color: "#000" }]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    includeFontPadding: false,
  },
  secondary: {
    borderWidth: 1,
    borderColor: "#D3D3D3",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
  },
});
