import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";

export default function BulkActions({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <Text style={styles.title}>Bulk Actions</Text>

        {/* BULK ADD */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("AddDevice", { bulk: true })}        >
          <Text style={styles.cardText}>➕ Add Devices in Bulk</Text>
        </TouchableOpacity>

        {/* BULK ASSIGN */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("AssignDevice", { bulk: true })}
        >
          <Text style={styles.cardText}>⚡ Assign Multiple Devices</Text>
        </TouchableOpacity>

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

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2
  },

  cardText: {
    fontSize: 16,
    fontWeight: "500"
  }
});