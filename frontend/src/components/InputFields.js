import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { COLORS } from "@utils/constants";

export default function InputFields({
  rightIcon,
  onRightIconPress,
  style,
  ...props
}) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        {...props}
        style={[styles.input, style]}
        placeholderTextColor="#94A3B8"
      />

      {rightIcon && (
        <TouchableOpacity
          onPress={onRightIconPress}
          style={styles.icon}
        >
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 10,
    marginVertical: 6,
    justifyContent: "center"
  },

  input: {
    height: 45,
    paddingHorizontal: 12,
    paddingRight: 40, // 🔥 space for icon
    color: "#000"
  },

  icon: {
    position: "absolute",
    right: 12,
    height: "100%",
    justifyContent: "center"
  }
});