import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity
} from "react-native";

import { useStore } from "@store/useStore";

export default function ActivityLogs() {

  const history = (
    useStore(state => state.history || [])
  ).slice(0, 20);
console.log("HISTORY:", history);

  const clearHistory = useStore(
    state => state.clearHistory
  );

  const deleteHistoryItem = useStore(
    state => state.deleteHistoryItem
  );

  const [selectionMode, setSelectionMode] =
    useState(false);

  const [selectedItems, setSelectedItems] =
    useState([]);

  // ================= TOGGLE SELECTION =================
  const toggleSelection = (id) => {

    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  // ================= DELETE ACTION =================
  const handleDelete = () => {

    if (selectedItems.length > 0) {

      selectedItems.forEach(id => {
        deleteHistoryItem(id);
      });

    } else {

      clearHistory();
    }

    setSelectedItems([]);
    setSelectionMode(false);
  };

  // ================= RENDER ITEM =================
  const renderItem = ({ item }) => {

    const selected =
      selectedItems.includes(item.id);

    return (
      <TouchableOpacity
        onLongPress={() => {
          setSelectionMode(true);
          toggleSelection(item.id);
        }}
        onPress={() => {
          if (selectionMode) {
            toggleSelection(item.id);
          }
        }}
      >
        <View
          style={[
            styles.card,
            selected && styles.selectedCard
          ]}
        >

          {/* CHECKBOX */}
          {selectionMode && (
            <Text style={styles.checkbox}>
              {selected ? "☑️" : "⬜"}
            </Text>
          )}

          {/* TITLE */}
          <Text style={styles.title}>
            {item.label}
          </Text>

          {/* NOTE */}
          {!!item.note && (
            <Text style={styles.note}>
              {item.note}
            </Text>
          )}

          
          {!!item.device_imei && (
  <Text style={styles.imei}>
    IMEI: {item.device_imei}
  </Text>
)}

          {/* DATE TIME */}
          <Text style={styles.meta}>
            {
  item.created_at
    ? new Date(item.created_at).toLocaleString()
    : "-"
}
          </Text>

        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <Text style={styles.headerTitle}>
          RECENT ACTIVITY
        </Text>

        <Text style={styles.subTitle}>
          Latest operational events
        </Text>

      </View>

      {/* SELECTION BAR */}
      {selectionMode && (
       <View style={styles.selectionBar}>

  <TouchableOpacity
    onPress={() => {
      setSelectionMode(false);
      setSelectedItems([]);
    }}
  >
    <Text style={styles.cancelText}>
      Cancel
    </Text>
  </TouchableOpacity>

  <Text style={styles.selectionText}>
    {selectedItems.length} selected
  </Text>

  <TouchableOpacity onPress={handleDelete}>
    <Text style={styles.deleteText}>
      {selectedItems.length > 0
        ? "Delete Selected"
        : "Clear All"}
    </Text>
  </TouchableOpacity>

</View>
      )}

      {/* CONTENT */}
      {history.length === 0 ? (

        <Text style={styles.empty}>
          No activity yet
        </Text>

      ) : (

        <FlatList
          data={history}
          keyExtractor={(item, index) =>
            item.id + "-" + index
          }
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

  selectionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#DBEAFE",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12
  },

  selectionText: {
    fontWeight: "600"
  },

  deleteText: {
    color: "#DC2626",
    fontWeight: "700"
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: "#2563EB"
  },

  checkbox: {
    fontSize: 18,
    marginBottom: 6
  },

  title: {
    fontWeight: "600",
    fontSize: 14
  },
  cancelText: {
  color: "#2563EB",
  fontWeight: "600"
},

imei: {
  fontSize: 12,
  color: "#2563EB",
  marginTop: 4,
  fontWeight: "600"
},

  note: {
    fontSize: 13,
    color: "#334155",
    marginTop: 4
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