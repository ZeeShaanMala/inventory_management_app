import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "@utils/constants";

export default function PrimaryButton({ title, onPress, icon }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      
      {icon && (
        <Text style={styles.icon}>
          {icon}
        </Text>
      )}

      <Text style={styles.text}>{title}</Text>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 2
  },

  icon: {
    fontSize: 16,
    marginRight: 6,
    color: "#fff"
  },

  text: {
    color: "#fff",
    fontWeight: "bold"
  }
});