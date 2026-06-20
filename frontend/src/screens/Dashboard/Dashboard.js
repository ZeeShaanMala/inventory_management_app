import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated
} from "react-native";
import { useStore } from "@store/useStore";
import { STATUS } from "@utils/constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useLayoutEffect } from "react";

export default function Dashboard({ navigation }) {

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  const { devices,history } = useStore();

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [chartType, setChartType] = useState("sold");
  const [menuVisible, setMenuVisible] = useState(false);

  const tooltipOpacity = useRef(new Animated.Value(0)).current;

  const barWidth = 20;
  const barSpacing = 10;

  // ---------------- STATS ----------------
  const normalize = (s) =>
    s?.toLowerCase().replace(/[\s_]/g, "");

  const count = (status) =>
    devices.filter(
      d => normalize(d.status) === normalize(status)
    ).length;

  const stats = [
    { label: "Stock", value: count(STATUS.IN_STOCK), icon: "cube-outline" },
    { label: "Assigned", value: count(STATUS.ASSIGNED), icon: "account-arrow-right" },
    { label: "ACTIVATED", value: count(STATUS.ACTIVATED), icon: "tools" },
    { label: "Sold", value: count(STATUS.SOLD), icon: "tag" }
  ];

  // ---------------- HISTORY ----------------
const recentHistory = [...history]
  .reverse()
  .slice(0, 5);

  // ---------------- CHART DATA ----------------
  const getChartData = () => {
  const days = 7;
  const result = new Array(days).fill(0);

  devices.forEach(device => {

    let dateField = null;

    if (chartType === "sold" && device.sold_at) {
      dateField = device.sold_at;
    }

   

    if (chartType === "in_stock" && device.created_at) {
      dateField = device.created_at;
    }

    if (!dateField) return;

    const date = new Date(dateField);

    const diff = Math.floor(
      (new Date() - date) / (1000 * 60 * 60 * 24)
    );

    if (diff >= 0 && diff < days) {
      result[days - diff - 1]++;
    }
  });

  return result;
};

  const chartData = getChartData();
  const max = Math.max(...chartData, 1);
  const normalized = chartData.map(v => (v / max) * 120);
  const hasData = chartData.some(v => v > 0);

  // ---------------- BAR PRESS ----------------
  const handleBarPress = (i) => {
    setSelectedIndex(i);

    tooltipOpacity.setValue(0);
    Animated.timing(tooltipOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  const getDayLabel = (index) => {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  return days[index % 7];
};

const getBarColor = (type) => {
  switch (type) {
    case "sold":
      return "#22C55E"; // green
    case "assigned":
      return "#3B82F6"; // blue
    case "in_stock":
      return "#F59E0B"; // amber
    default:
      return "#93C5FD";
  }
};

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 , gap: 16}}>

        {/* HEADER */}
        <View style={styles.header}>

          {/* ✅ FIXED: clickable burger */}
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon name="menu" size={22} />
          </TouchableOpacity>

          <Text style={styles.title}>📊 Dashboard</Text>

          {/* ✅ spacer instead of avatar */}
          <View style={{ width: 22 }} />

        </View>

        {/* CARDS */}
        <View style={styles.bentoGrid}>
          {stats.map((item, i) => (
            <View key={i} style={styles.smallCard}>
              <Icon name={item.icon} size={20} />
              <Text style={styles.cardValue}>{item.value}</Text>
              <Text style={styles.cardLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* CHART */}
        <View style={styles.chartBox}>

          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>
              {chartType.replace("_", " ").toUpperCase()} Trends
            </Text>

            <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
              <Icon name="dots-vertical" size={18} />
            </TouchableOpacity>
          </View>

          {/* MENU */}
          {menuVisible && (
            <View style={styles.menu}>
              {["sold","in_stock"].map(type => (
                <TouchableOpacity
                  key={type}
                  onPress={() => {
                    setChartType(type);
                    setMenuVisible(false);
                    setSelectedIndex(null);
                  }}
                >
              <Text style={styles.menuItem}>
                {type.replace("_", " ").toUpperCase()}
              </Text>                
                  </TouchableOpacity>
              ))}
            </View>
          )}

          
           {/* CHART AREA */}
{!hasData ? (
  <View style={styles.emptyChart}>
    <Text style={styles.emptyText}>
      No data available
    </Text>
  </View>
) : (
  <View style={styles.chartRow}>
  {normalized.map((h, i) => (
    <TouchableOpacity key={i} onPress={() => handleBarPress(i)}>
      <View style={styles.barContainer}>
        <Text style={styles.barValue}>
  {chartData[i]}
</Text>
        <View
  style={[
    styles.bar,
    {
      height: h,
      backgroundColor:
        i === selectedIndex
          ? "#1E40AF"
          : getBarColor(chartType),
      transform: [{ scale: i === selectedIndex ? 1.1 : 1 }]
    }
  ]}
/>

        {/* DAY LABEL */}
        <Text style={styles.dayLabel}>
          {getDayLabel(i)}
        </Text>

      </View>
    </TouchableOpacity>
  ))}
</View>
  
)}

          {/* TOOLTIP */}
          {selectedIndex !== null && hasData && (
            <Animated.View
              style={[
                styles.tooltip,
                {
                  opacity: tooltipOpacity,
                  bottom: normalized[selectedIndex] + 60,
                  left: selectedIndex * (barWidth + barSpacing)
                }
              ]}
            >
              <Text style={styles.tooltipText}>
  {getDayLabel(selectedIndex)}
              </Text>
              <Text style={styles.tooltipValue}>
                {chartData[selectedIndex]} events
              </Text>
            </Animated.View>
          )}

        </View>

        {/* HISTORY */}
<View style={styles.historySection}>
  <Text style={styles.sectionTitle}>Recent History</Text>

  {recentHistory.length === 0 ? (
    <Text style={styles.emptyText}>No recent activity</Text>
  ) : (
    <>
      {recentHistory.map((item, index) => (
        <View
  key={item.id + "-" + index}
  style={styles.historyCard}
>

  <Text style={styles.historyText}>
    {item.label}
  </Text>

  {!!item.note && (
    <Text style={styles.historyNote}>
      {item.note}
    </Text>
  )}
  {!!item.device_imei && (
  <Text style={styles.imei}>
    IMEI: {item.device_imei}
  </Text>
)}

  <Text style={styles.historyMeta}>
    {
  item?.created_at
    ? new Date(item.created_at).toLocaleString()
    : "-"
}
  </Text>

</View>
      ))}

      <TouchableOpacity
        onPress={() => navigation.navigate("MainApp", { screen: "ActivityLogs" })}
      >
        <Text style={styles.viewAllText}>
          View All Activity →
        </Text>
      </TouchableOpacity>
    </>
  )}
</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F6F8" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff"
  },

title: {
  fontSize: 20,
  fontWeight: "700"
},

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1E4E79"
  },

  searchInput: {
    margin: 16,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10
  },

  bentoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between"
  },

  smallCard: {
  width: "48%",
  backgroundColor: "#fff",
  padding: 14,
  borderRadius: 14,
  marginBottom: 12,
  elevation: 3
},

  cardValue: { fontSize: 20, fontWeight: "700" },
  cardLabel: { color: "#64748B", fontSize: 12 },

  chartBox: {
  backgroundColor: "#FFFFFF",
  marginHorizontal: 16,
  padding: 18,
  borderRadius: 18,
  elevation: 4,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  overflow: "visible",
  shadowRadius: 10
},

  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

sectionTitle: {
  fontWeight: "700",
  fontSize: 14,
  color: "#0F172A"
},

  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 160,
    marginTop: 10
  },

  bar: {
  width: 28,
  borderRadius: 10,
  marginBottom: 6
},

barValue: {
  fontSize: 11,
  fontWeight: "600",
  marginBottom: 4,
  color: "#334155"
},

dayLabel: {
  fontSize: 10,
  color: "#64748B"
},

  barContainer: {
  alignItems: "center",
  marginRight: 19
},

  tooltip: {
    position: "absolute",
    backgroundColor: "#1E293B",
    padding: 8,
    borderRadius: 6,
    alignItems: "center"
  },

  tooltipText: { color: "#CBD5F5", fontSize: 12 },
  tooltipValue: { color: "#fff", fontWeight: "600" },

  menu: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    elevation: 5,
    zIndex: 999,
elevation: 10
  },

  menuItem: {
    padding: 8,
    fontSize: 14
  },

  emptyChart: {
    height: 100,
    justifyContent: "center",
    alignItems: "center"
  },

  emptyText: {
    color: "#94A3B8"
  },

  historySection: { paddingHorizontal: 16 },

  historyCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 10
  },

  historyNote: {
  fontSize: 12,
  color: "#000000",
  marginTop: 10,
  marginBottom: 10
},

historyText: {
  fontWeight: "500",
  marginBottom: 4
},  

imei: {
  fontSize: 12,
  color: "#2563EB",
  marginTop: 4,
  fontWeight: "600"
},

historyMeta: { fontSize: 12, color: "#64748B" },

  emptyText: {
  color: "#94A3B8",
  marginTop: 10,
  fontSize: 13
},

viewAllText: {
  color: "#1E3A8A",
  marginTop: 10,
  fontWeight: "600"
},

  fab: {
    position: "absolute",
    bottom: 25,
    right: 20,
    backgroundColor: "#1E40AF",
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center"
  }
});