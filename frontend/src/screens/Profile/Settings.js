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

      {/* HEADER */}
      <View style={styles.header}>
  <Text style={styles.screenTitle}>
    Settings
  </Text>

  <Text style={styles.screenSubtitle}>
    Manage application preferences
  </Text>
</View>

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
     {/* SYSTEM */}
<View style={styles.card}>

  <Text style={styles.title}>
    System
  </Text>

  <View style={styles.infoRow}>
    <Text style={styles.label}>
      Language
    </Text>

    <Text style={styles.value}>
      English
    </Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.label}>
      Version
    </Text>

    <Text style={styles.value}>
      1.0.0
    </Text>
  </View>

</View>
    {/* ABOUT */}
      <View style={styles.card}>

  <Text style={styles.title}>
    About
  </Text>

  <Text style={styles.label}>
    GPS Inventory System
  </Text>

  
</View>

    </View>
  );
}

const Row = ({ label, value, onToggle }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Switch
  value={value}
  onValueChange={onToggle}
  trackColor={{
    false: "#CBD5E1",
    true: "#93C5FD"
  }}
  thumbColor={
    value
      ? "#1E3A8A"
      : "#F8FAFC"
  }
/>
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
    borderRadius: 18,
    marginBottom: 12,
    elevation: 2,
shadowColor: "#000",
shadowOpacity: 0.04,
shadowRadius: 6,
shadowOffset: {
  width: 0,
  height: 2
}
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
  },
  infoRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 12
},
header: {
  marginBottom: 20
},

screenTitle: {
  fontSize: 30,
  fontWeight: "700",
  color: "#1E293B"
},

screenSubtitle: {
  color: "#64748B",
  marginTop: 4
}
});