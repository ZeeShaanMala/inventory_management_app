import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import { useStore } from "@store/useStore";

// ---------------- COLORS ----------------
const C = {
  bg: '#0D0F14',
  surface: '#161A22',
  surfaceHigh: '#1E2330',
  border: '#252C3D',
  accent: '#00D4AA',
  text: '#EAEEF7',
  textSub: '#8892A4',
  textMuted: '#4A5568',

  available: { bg: '#0A2418', text: '#00D97E', dot: '#00D97E', border: '#00D97E33' },
  assigned:  { bg: '#0A1830', text: '#4A9EFF', dot: '#4A9EFF', border: '#4A9EFF33' },
  activated: { bg: '#0A2418', text: '#00D97E', dot: '#00D97E', border: '#00D97E33' },
  sold:      { bg: '#161616', text: '#8892A4', dot: '#8892A4', border: '#8892A433' },
  returned:  { bg: '#220A0A', text: '#FF5C5C', dot: '#FF5C5C', border: '#FF5C5C33' },
};

const STATUS_LABEL = {
  available: 'Available',
  assigned:  'Assigned',
  activated: 'Activated',
  sold:      'Sold',
  returned:  'Returned',
};


// 🔥 NORMALIZER
const normalize = (s) =>
  s?.toLowerCase().replace(/[\s_]/g, "");

// ---------------- QUICK CARD ----------------
const QuickCard = ({ label, value }) => (
  <View style={styles.quickCard}>
    <Text style={styles.quickLabel}>{label}</Text>
    <Text style={styles.quickValue}>{value}</Text>
  </View>
);

// ---------------- MAIN ----------------
const DeviceDetail = ({ route, navigation }) => {
  const { imei } = route.params;

  console.log("ROUTE PARAMS:", route.params);
  console.log("IMEI RECEIVED:", imei);

  const devices = useStore(state => state.devices);
  console.log("DEVICES:", devices);
  // ✅ ALWAYS GET FRESH DATA FROM ZUSTAND
  const device = useStore((state) =>
    state.devices.find(d => String(d.imei) === String(imei))
  ) || {};

  const { parties } = useStore();
  const assignedParty = parties?.find(p => p.id === device.assignedTo);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const sc = C[normalize(device?.status || "")] ?? C.available;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerMid}>
          <Text style={styles.headerTitle}>Device Details</Text>
          <Text style={styles.headerSub}>{device?.imei || "N/A"}</Text>
        </View>
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 16 }}>

          {/* HERO */}
          <View style={styles.heroCard}>
            <Text style={styles.heroModel}>{device?.model || "IN STOCK"}</Text>
            <Text style={styles.heroIMEI}>{device?.imei || "N/A"}</Text>

            <View style={[styles.statusPill, { backgroundColor: sc.bg }]}>
              <Text style={{ color: sc.text }}>
                {STATUS_LABEL[normalize(device?.status || "")] || "IN STOCK"}
              </Text>
            </View>
          </View>

          {/* ✅ FIXED BUTTON CONDITION */}
         {normalize(device?.status) === "assigned" && (
  <>
    {/* Activate */}
    <TouchableOpacity
      style={{ marginTop: 15, backgroundColor: "#16A34A", padding: 12, borderRadius: 10 }}
      onPress={() =>
        navigation.navigate("ActivateDevice", { imei: device.imei })
      }
    >
      <Text style={{ color: "#fff", textAlign: "center" }}>
        Activate Device
      </Text>
    </TouchableOpacity>

    {/* 🔥 Unassign */}
    <TouchableOpacity
      style={{ marginTop: 10, backgroundColor: "#F59E0B", padding: 12, borderRadius: 10 }}
      onPress={() =>
        navigation.navigate("ActionDevice", {
          imei: device.imei,
          action: "unassign"
        })
      }
    >
      <Text style={{ color: "#fff", textAlign: "center" }}>
        Unassign Device
      </Text>
    </TouchableOpacity>
  </>
)}
          {normalize(device?.status) === "activated" && (
  <>
    {/* Mark Sold */}
    <TouchableOpacity
      style={{
        marginTop: 15,
        backgroundColor: "#DC2626",
        padding: 12,
        borderRadius: 10
      }}
      onPress={() =>
        navigation.navigate("MarkSold", { imei: device.imei })
      }
    >
      <Text style={{ color: "#fff", textAlign: "center" }}>
        Mark as Sold
      </Text>
    </TouchableOpacity>

    {/* 🔥 Return Device */}
    <TouchableOpacity
      style={{
        marginTop: 10,
        backgroundColor: "#7C3AED",
        padding: 12,
        borderRadius: 10
      }}
      onPress={() =>
        navigation.navigate("ActionDevice", {
          imei: device.imei,
          action: "return"
        })
      }
    >
      <Text style={{ color: "#fff", textAlign: "center" }}>
        Return Device
      </Text>
    </TouchableOpacity>
  </>
)}

          {/* QUICK CARDS */}
          <View style={styles.quickGrid}>
            <QuickCard
              label="IMEI"
              value={(device?.imei || "")
                .toString()
                .replace(/(\d{5})(\d{5})(\d{5})/, "$1 $2 $3")}
            />

            <QuickCard label="Model" value={device?.model || "N/A"} />
            <QuickCard label="SIM Number" value={device?.sim_number || "N/A"} />

            <QuickCard
              label="Assigned To"
              value={assignedParty?.name || "Not Assigned"}
            />

            <QuickCard
              label="Truck No."
              value={device?.vehicleNumber || "Not Assigned"}
            />
            <QuickCard
  label="Profit"
  value={`₹${(device?.sellingPrice || 0) - (device?.costPrice || 0)}`}
/>
          </View>

          {/* TIMELINE */}
          <Text style={styles.sectionTitle}>Lifecycle History</Text>

          {(device.history || []).map((item, i) => (
            <View key={i} style={styles.timelineItem}>
              <View style={styles.dot} />
              <View>
                <Text style={styles.timelineTitle}>{item?.label || "-"}</Text>
                <Text style={styles.timelineMeta}>
                  {(item?.date || "-") + " • " + (item?.time || "-")}
                </Text>
              </View>
            </View>
          ))}

          {/* MAP */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Last Known Location</Text>
            <View style={styles.mapBox}>
              <Text style={{ color: C.textMuted }}>Map Coming Soon</Text>
            </View>
          </View>

          {/* DIAGNOSTICS */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Diagnostics</Text>

            <View style={styles.quickGrid}>
              <QuickCard label="Temp" value="32°C" />
              <QuickCard label="Latency" value="42ms" />
            </View>
          </View>

        </ScrollView>
      </Animated.View>
    </View>
  );
};


// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },

  backIcon: { color: "#fff", fontSize: 28 },

  headerMid: { flex: 1, alignItems: "center" },

  headerTitle: { color: "#fff", fontWeight: "600" },

  headerSub: { color: "#64748B", fontSize: 12 },

  heroCard: {
    backgroundColor: C.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  heroModel: { color: "#fff", fontSize: 18, fontWeight: "700" },

  heroIMEI: { color: "#94A3B8", fontSize: 12 },

  statusPill: {
    marginTop: 8,
    padding: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  quickCard: {
    width: "48%",
    backgroundColor: C.surface,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  quickLabel: { color: C.textMuted, fontSize: 11 },

  quickValue: { color: "#fff", fontWeight: "600" },

  sectionTitle: {
    color: "#94A3B8",
    marginTop: 10,
    marginBottom: 6,
  },

  timelineItem: {
    flexDirection: "row",
    marginBottom: 10,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3B82F6",
    marginRight: 10,
    marginTop: 5,
  },

  timelineTitle: { color: "#fff" },

  timelineMeta: { color: "#64748B", fontSize: 11 },

  card: {
    backgroundColor: C.surface,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },

  mapBox: {
    height: 150,
    backgroundColor: C.surfaceHigh,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DeviceDetail;