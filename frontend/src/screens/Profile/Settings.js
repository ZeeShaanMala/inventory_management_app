import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { useStore } from "@store/useStore";

export default function Settings() {
  const {
    settings,
    toggleNotifications,
    toggleEmailReports,
    toggleTwoFactor
  } = useStore();

  return (
    <View style={styles.container}>

      {/* NOTIFICATIONS */}
      <View style={styles.card}>
        <Text style={styles.title}>Notifications</Text>

        <Row
          label="Push Notifications"
          value={settings.notifications}
          onToggle={toggleNotifications}
        />

        <Row
          label="Email Reports"
          value={settings.emailReports}
          onToggle={toggleEmailReports}
        />
      </View>

      {/* SECURITY */}
      <View style={styles.card}>
        <Text style={styles.title}>Security</Text>

        <Row
          label="Two-Factor Authentication"
          value={settings.twoFactor}
          onToggle={toggleTwoFactor}
        />
      </View>

      {/* SYSTEM */}
      <View style={styles.card}>
        <Text style={styles.title}>System</Text>

        <Text style={styles.label}>Language</Text>
        <Text style={styles.value}>English</Text>

        <Text style={styles.label}>Version</Text>
        <Text style={styles.value}>1.0.0</Text>
      </View>

    </View>
  );
}

const Row = ({ label, value, onToggle }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Switch value={value} onValueChange={onToggle} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F4F6F8"
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },

  label: {
    fontSize: 14,
    color: "#64748B"
  },

  value: {
    fontSize: 14,
    fontWeight: "500"
  }
});