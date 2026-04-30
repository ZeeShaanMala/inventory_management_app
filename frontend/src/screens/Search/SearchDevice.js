import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView
} from "react-native";
import InputFields from "../../components/InputFields";
import { useStore } from "@store/useStore";
import DeviceCard from "../../components/DeviceCard";

export default function SearchDevice() {
  const [query, setQuery] = useState("");
  const { devices } = useStore();

  const result = devices.find(d => d.imei === query);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Search Device</Text>
          <Text style={styles.subtitle}>
            Find device using IMEI
          </Text>
        </View>

        {/* Search Card */}
        <View style={styles.card}>
          <Text style={styles.label}>IMEI Number</Text>

          <InputFields
            placeholder="Enter IMEI"
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {/* Result Section */}
        {query.length > 0 && (
          <View style={styles.resultContainer}>
            {result ? (
              <>
                <Text style={styles.resultTitle}>✅ Device Found</Text>
                <DeviceCard device={result} />
              </>
            ) : (
              <View style={styles.notFoundBox}>
                <Text style={styles.notFoundIcon}>❌</Text>
                <Text style={styles.notFound}>No device found</Text>
              </View>
            )}
          </View>
        )}

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

  header: {
    marginBottom: 20
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A"
  },

  subtitle: {
    color: "#64748B",
    marginTop: 4
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },

  label: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 6
  },

  resultContainer: {
    marginTop: 20
  },

  resultTitle: {
    fontWeight: "600",
    marginBottom: 10,
    color: "#16A34A"
  },

  notFoundBox: {
    alignItems: "center",
    marginTop: 20
  },

  notFoundIcon: {
    fontSize: 30,
    marginBottom: 6
  },

  notFound: {
    color: "#DC2626",
    fontWeight: "500"
  }
});