import React from "react";
import { View, Text, StyleSheet } from "react-native";
import StatusBadge from "@components/StatusBadge";

export default function DeviceCard({ device }) {
  if (!device) return null;

  return (
    <View style={styles.card}>
      
      {/* Top Row (IMEI + Status) */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.label}>IMEI</Text>
          <Text style={styles.imei}>{device.imei}</Text>
        </View>

        <StatusBadge status={device.status} />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Details */}
      {device.vehicleNumber && (
        <View style={styles.infoRow}>
          <Text style={styles.icon}>🚗</Text>
          <Text style={styles.text}>{device.vehicleNumber}</Text>
        </View>
      )}

      {device.customerName && (
        <View style={styles.infoRow}>
          <Text style={styles.icon}>👤</Text>
          <Text style={styles.text}>{device.customerName}</Text>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  label: {
    fontSize: 11,
    color: "#94A3B8",
    marginBottom: 2
  },

  imei: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A"
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 10
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6
  },

  icon: {
    fontSize: 14,
    marginRight: 6
  },

  text: {
    color: "#475569",
    fontSize: 13
  }
});