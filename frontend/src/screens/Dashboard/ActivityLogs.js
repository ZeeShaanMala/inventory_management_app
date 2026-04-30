import React from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { useStore } from "@store/useStore";

export default function ActivityLogs() {
  const history = useStore(state => state.history || []);

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.label}</Text>
      <Text style={styles.meta}>
        {item.date} • {item.time}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      {/* 🔥 HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HISTORY</Text>
        <Text style={styles.subTitle}>
          Track all device lifecycle actions
        </Text>
      </View>

      {/* 🔥 CONTENT */}
      {history.length === 0 ? (
        <Text style={styles.empty}>No activity yet</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => item.id + "-" + index} // ✅ FIXED
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F4F6F8"
  },

  header: {
    marginBottom: 16
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A"
  },

  subTitle: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 2
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2
  },

  title: {
    fontWeight: "600",
    fontSize: 14
  },

  meta: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#64748B"
  }
});