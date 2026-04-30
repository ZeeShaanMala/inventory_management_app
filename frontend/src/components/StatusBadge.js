import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { STATUS } from "@utils/constants";

export default function StatusBadge({ status }) {
  if (!status) return null;

  const statusStyles = {
    [STATUS.IN_STOCK]: {
      bg: "#DBEAFE",
      text: "#1D4ED8"
    },
    [STATUS.ASSIGNED]: {
      bg: "#EDE9FE",
      text: "#6D28D9"
    },
    [STATUS.Activated]: {
      bg: "#FEF3C7",
      text: "#B45309"
    },
    [STATUS.SOLD]: {
      bg: "#DCFCE7",
      text: "#15803D"
    }
  };

  const current = statusStyles[status] || {
    bg: "#E5E7EB",
    text: "#374151"
  };

  return (
    <View style={[styles.badge, { backgroundColor: current.bg }]}>
      <Text style={[styles.text, { color: current.text }]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: "flex-start"
  },

  text: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize"
  }
});