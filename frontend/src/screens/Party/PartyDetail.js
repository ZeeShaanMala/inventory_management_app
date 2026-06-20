import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList
} from "react-native";

import { useStore } from "@store/useStore";

export default function PartyDetails({ route }) {

  const { party } = route.params;

  const devices =
    useStore(state => state.devices);

  const assignedDevices =
  devices.filter(
    d => d.assigned_to === party.id
  );
    console.log(devices);
console.log(party);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.headerCard}>

          <Text style={styles.partyName}>
            {party.name}
          </Text>

          <Text style={styles.info}>
            📞 {party.phone}
          </Text>

          <Text style={styles.info}>
            📍 {party.city}
          </Text>

          <Text style={styles.info}>
            🏢 {party.type}
          </Text>

        </View>

        {/* STATS */}
        <View style={styles.statsCard}>

          <Text style={styles.statsTitle}>
            Device Statistics
          </Text>

          <Text style={styles.statsText}>
            Total Assigned Devices:
            {" "}
            {assignedDevices.length}
          </Text>

        </View>

        {/* DEVICE LIST */}
        <Text style={styles.sectionTitle}>
          Assigned Devices
        </Text>

        <FlatList
          data={assignedDevices}
          keyExtractor={(item) => item.imei}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No devices assigned
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.deviceCard}>

              <Text style={styles.imei}>
                {item.imei}
              </Text>

              <Text style={styles.status}>
                {item.status}
              </Text>

            </View>
          )}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },

  container: {
    flex: 1,
    padding: 20
  },

  headerCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 16
  },

  partyName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10
  },

  info: {
    color: "#475569",
    marginBottom: 4
  },

  statsCard: {
    backgroundColor: "#DBEAFE",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16
  },

  statsTitle: {
    fontWeight: "700",
    marginBottom: 6
  },

  statsText: {
    color: "#1E3A8A"
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10
  },

  deviceCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10
  },

  imei: {
    fontWeight: "700"
  },

  status: {
    marginTop: 4,
    color: "#64748B"
  },

  empty: {
    color: "#94A3B8",
    marginTop: 20,
    textAlign: "center"
  }

});