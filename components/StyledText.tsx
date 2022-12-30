import { Text, TextProps } from "react-native";

export function MonoText(props: TextProps & { bold?: boolean }) {
  return (
    <Text
      {...props}
      style={[
        props.style,
        { fontFamily: props.bold ? "space-bold" : "space-mono" },
      ]}
    />
  );
}
