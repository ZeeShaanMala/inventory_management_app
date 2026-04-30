import React, { useRef, useEffect, memo, useState, useLayoutEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Pressable,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";

import { useStore } from "@store/useStore";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Swipeable } from "react-native-gesture-handler";

// 🔥 NORMALIZER
const normalizeStatus = (status) =>
  status?.toString().toLowerCase().replace(/[\s_]/g, "").trim();

// ---------------- FILTERS ----------------
const FILTERS = [
  { label: "ALL", value: "ALL" },
  { label: "STOCK", value: "instock" },
  { label: "ASSIGNED", value: "assigned" },
  { label: "Activated", value: "activated" }, // ✅ FIXED
  { label: "SOLD", value: "sold" }
];

// ---------------- ANIMATED ITEM ----------------
const AnimatedDeviceItem = memo(({ item, index, navigation, handleDelete }) => {
  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        delay: index * 60,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY }, { scale }],
        opacity,
        overflow: "hidden"
      }}
    >
      <Swipeable
        overshootRight={false}
        friction={2}
        rightThreshold={40}
        renderRightActions={() => (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#3B82F6" }]}
              onPress={() =>
                navigation.navigate("AddDevice", { editData: item })
              }
            >
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#10B981" }]}
              onPress={() =>
                navigation.navigate("AssignDevice", { device: item })
              }
            >
              <Text style={styles.actionText}>Assign</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#EF4444" }]}
              onPress={() => handleDelete(item)}
            >
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      >
        <Pressable
          android_ripple={{ color: "#E2E8F0" }}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() =>
            navigation.navigate("DeviceDetail", { imei: item.imei })
          }
        >
          <View style={styles.deviceCard}>
            <View style={styles.left}>
              <View style={styles.iconBox}>
                <Icon name="wifi" size={18} color="#1E3A8A" />
              </View>

              <View>
                <Text style={styles.deviceTitle}>
  {item?.alias || "Unnamed Device"}
</Text>

<Text style={styles.deviceSubtitle}>
  {(item?.imei || "N/A") + " • " + (item?.model || "Unknown")}
</Text>
              </View>
            </View>

            <View style={styles.right}>
              <View style={[styles.badge, getStatusColor(item.status)]}>
                <Text style={styles.badgeText}>
                  {item.status?.toUpperCase()}
                </Text>
              </View>
              <Icon name="chevron-right" size={18} />
            </View>
          </View>
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
});

// ---------------- MAIN SCREEN ----------------
export default function DeviceList() {
  const devices = useStore(state => state.devices);
  const deleteDevice = useStore(state => state.deleteDevice);
  const restoreDevice = useStore(state => state.restoreDevice);
  const navigation = useNavigation();

 useLayoutEffect(() => {
  navigation.setOptions({
    headerShown: false
  });
}, [navigation]);

  const [deletedItem, setDeletedItem] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const handleDelete = (item) => {
    Alert.alert("Delete Device", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteDevice(item.imei);
          setDeletedItem(item);
          setShowUndo(true);
          setTimeout(() => setShowUndo(false), 4000);
        }
      }
    ]);
  };

  const handleUndo = () => {
    if (deletedItem) {
      restoreDevice(deletedItem);
      setShowUndo(false);
    }
  };

  const filteredDevices = devices.filter((d) => {
  const query = (searchQuery || "").toString().toLowerCase().trim();
  const status = normalizeStatus(d.status);

  const filterMatch =
    activeFilter === "ALL" || status === activeFilter;

  // 🔥 IMPORTANT: skip search if empty
  if (query === "") {
    return filterMatch;
  }

  const searchMatch =
    (d.imei || "").toString().toLowerCase().includes(query) ||
    (d.model || "").toString().toLowerCase().includes(query) ||
    (d.vehicleNumber || "").toString().toLowerCase().includes(query) ||
    (d.customerName || "").toString().toLowerCase().includes(query) ||
    (d.alias || "").toString().toLowerCase().includes(query);

  return searchMatch && filterMatch;
});

  const statusCount = devices.reduce(
    (acc, d) => {
      const status = normalizeStatus(d.status);

      if (status === "instock") acc.stock++;
      else if (status === "assigned") acc.assigned++;
      else if (status === "activated") acc.Activated++; // ✅ FIXED
      else if (status === "sold") acc.sold++;

      acc.all++;
      return acc;
    },
    { all: 0, stock: 0, assigned: 0, Activated: 0, sold: 0 }
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

       <View style={styles.header}>
  <Text style={styles.headerTitle}>Device List</Text>
</View>

{/* 🔥 ACTION BUTTONS */}
<View style={styles.actionRow}>

  <TouchableOpacity
    style={styles.actionBtnPrimary}
    onPress={() => navigation.navigate("AddDevice")}
  >
    <Text style={styles.actionBtnText}>➕ Add Device</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.actionBtnSecondary}
    onPress={() => navigation.navigate("BulkActions")}
  >
    <Text style={styles.actionBtnText}>⚡ Bulk Actions</Text>
  </TouchableOpacity>

</View>

        <View style={styles.searchWrapper}>
          <Icon name="magnify" size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            placeholder="Search by IMEI, model, vehicle..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInputNew}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Icon name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filters}>
          {FILTERS.map((f) => {
            const count =
              f.value === "ALL"
                ? statusCount.all
                : f.value === "instock"
                ? statusCount.stock
                : f.value === "assigned"
                ? statusCount.assigned
                : f.value === "activated"
                ? statusCount.Activated
                : statusCount.sold;

            return (
              <TouchableOpacity
                key={f.value}
                style={
                  activeFilter === f.value
                    ? styles.activeFilter
                    : styles.filter
                }
                onPress={() => setActiveFilter(f.value)}
              >
                <Text
                  style={
                    activeFilter === f.value
                      ? styles.activeFilterText
                      : styles.filterText
                  }
                >
                  {f.label} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={filteredDevices}
          extraData={filteredDevices}  
keyExtractor={(item, index) => item?.imei?.toString() + "-" + index}          renderItem={({ item, index }) => (
            <AnimatedDeviceItem
              item={item}
              index={index}
              navigation={navigation}
              handleDelete={handleDelete}
            />
          )}
        />

        {showUndo && (
          <View style={styles.snackbar}>
            <Text style={styles.snackbarText}>Device deleted</Text>
            <TouchableOpacity onPress={handleUndo}>
              <Text style={styles.undoText}>UNDO</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// ---------------- STATUS COLORS ----------------
const getStatusColor = (status) => {
  const s = normalizeStatus(status);

  switch (s) {
    case "instock":
      return { backgroundColor: "#DCFCE7" };
    case "assigned":
      return { backgroundColor: "#DBEAFE" };
    case "activated": // ✅ FIXED
      return { backgroundColor: "#FEF3C7" };
    case "sold":
      return { backgroundColor: "#FECACA" };
    default:
      return { backgroundColor: "#E2E8F0" };
  }
};
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F1F5F9" },
  container: { flex: 1, padding: 16 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  headerTitle: { fontSize: 18, fontWeight: "700" },

  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10
  },

  activeFilter: {
    backgroundColor: "#1E3A8A",
    padding: 8,
    borderRadius: 20,
    margin: 4
  },

  activeFilterText: { color: "#fff" },

  filter: {
    backgroundColor: "#E2E8F0",
    padding: 8,
    borderRadius: 20,
    margin: 4
  },

  deviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    overflow: "hidden"
  },

  left: { flexDirection: "row" },

  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: "#E0E7FF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  deviceTitle: { fontWeight: "600" },

  deviceSubtitle: { fontSize: 12, color: "#64748B" },

  right: { alignItems: "flex-end" },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },

  badgeText: { fontSize: 10, fontWeight: "600" },

  actionsContainer: {
    flexDirection: "row",
    height: "100%",
    borderRadius: 12,
    overflow: "hidden"
  },

  actionBtn: {
    width: 70,
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },

  actionText: { color: "#fff" },

  snackbar: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: "#1E293B",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 10
  },

  snackbarText: { color: "#fff" },

  undoText: { color: "#60A5FA" },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 14,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },

  searchIcon: {
    marginRight: 8
  },

  searchInputNew: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A"
  },
  actionRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 12
},

actionBtnPrimary: {
  flex: 1,
  backgroundColor: "#1E3A8A",
  padding: 12,
  borderRadius: 10,
  marginRight: 8,
  alignItems: "center"
},

actionBtnSecondary: {
  flex: 1,
  backgroundColor: "#334155",
  padding: 12,
  borderRadius: 10,
  marginLeft: 8,
  alignItems: "center"
},

actionBtnText: {
  color: "#fff",
  fontWeight: "600"
},
});