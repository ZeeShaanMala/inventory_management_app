import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Animated,
  Pressable
} from "react-native";
import { useStore } from "@store/useStore";
import { BarChart, PieChart } from "react-native-chart-kit";
import LinearGradient from "react-native-linear-gradient";

const screenWidth = Dimensions.get("window").width;

export default function Analytics() {
  const { devices } = useStore();

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ---------------- ANIMATION ----------------
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true
    }).start();
  }, [selectedMonth]);

  // ---------------- HELPERS ----------------
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];

    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      days.push(d.toISOString().slice(0, 10));
    }

    return days;
  };

  const formatLabel = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getDate()}`;
  };

  const formatMonth = (date) => {
    return date.toLocaleString("default", {
      month: "long",
      year: "numeric"
    });
  };

  // ---------------- NORMALIZE (ONLY ONCE) ----------------
  const normalize = (s) =>
    s?.toLowerCase().replace(/[\s_]/g, "");

  // ---------------- SOLD FILTER (FIXED) ----------------
  const soldDevices = devices.filter(d => {
    if (normalize(d?.status || "") !== "sold") return false;

    if (!d.sold_at) return false;

const dDate = new Date(d.sold_at);

    return (
      dDate.getMonth() === selectedMonth.getMonth() &&
      dDate.getFullYear() === selectedMonth.getFullYear()
    );
  });

  // ---------------- KPI ----------------
  const totalRevenue = soldDevices.reduce(
    (sum, d) => sum + (Number(d.selling_price) || 0),
    0
  );

  const totalCost = soldDevices.reduce(
    (sum, d) => sum + (Number(d.cost_price) || 0),
    0
  );

  const profit = totalRevenue - totalCost;

  const avgPrice =
    soldDevices.length > 0
      ? Math.round(totalRevenue / soldDevices.length)
      : 0;

  // ---------------- TREND ----------------
  const days = getDaysInMonth(selectedMonth);

  const trend = days.map(day =>
    soldDevices.filter(d =>
      d.sold_at?.slice(0, 10) === day
    ).length
  );

  const profitTrend = days.map(day =>
    soldDevices
      .filter(d => d.sold_at?.slice(0, 10) === day)
      .reduce(
        (sum, d) =>
          sum + ((Number(d.selling_price) || 0) - (Number(d.cost_price) || 0)),
        0
      )
  );

  // ---------------- STATUS ----------------
  const statusCount = {
    Stock: devices.filter(d => normalize(d.status) === "instock").length,
    Assigned: devices.filter(d => normalize(d.status) === "assigned").length,
    Activated: devices.filter(d => normalize(d.status) === "activated").length,
    Sold: devices.filter(d => normalize(d.status) === "sold").length
  };

  const pieData = Object.keys(statusCount).map((key, i) => ({
    name: key,
    population: statusCount[key],
    color: ["#3B82F6", "#22C55E", "#F59E0B", "#EF4444"][i],
    legendFontColor: "#334155",
    legendFontSize: 12
  }));

  // ---------------- NAVIGATION ----------------
  const changeMonth = (dir) => {
    const d = new Date(selectedMonth);
    d.setMonth(d.getMonth() + dir);
    setSelectedMonth(d);
  };

  // ---------------- CARD ----------------
  const AnimatedCard = ({ children, colors }) => {
    const scale = useRef(new Animated.Value(1)).current;

    return (
      <Pressable
        onPressIn={() =>
          Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start()
        }
        onPressOut={() =>
          Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()
        }
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <LinearGradient colors={colors} style={styles.glassCard}>
            {children}
          </LinearGradient>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <LinearGradient colors={["#EEF2FF", "#F8FAFC"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>

          {/* HEADER */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Analytics</Text>
          </View>

          {/* MONTH SELECTOR */}
          <View style={styles.monthRow}>
            <TouchableOpacity onPress={() => changeMonth(-1)}>
              <Text style={styles.monthBtn}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.monthText}>
              {formatMonth(selectedMonth)}
            </Text>

            <TouchableOpacity onPress={() => changeMonth(1)}>
              <Text style={styles.monthBtn}>›</Text>
            </TouchableOpacity>
          </View>

          {/* KPI */}
          <View style={styles.row}>
            <AnimatedCard colors={["#60A5FA", "#BFDBFE"]}>
              <Text style={styles.statValue}>₹{totalRevenue}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </AnimatedCard>

            <AnimatedCard colors={["#34D399", "#BBF7D0"]}>
              <Text style={styles.statValue}>₹{profit}</Text>
              <Text style={styles.statLabel}>Profit</Text>
            </AnimatedCard>

            <AnimatedCard colors={["#FBBF24", "#FEF3C7"]}>
              <Text style={styles.statValue}>₹{avgPrice}</Text>
              <Text style={styles.statLabel}>Avg Price</Text>
            </AnimatedCard>
          </View>

          {/* SALES TREND */}
          <View style={styles.card}>
            <Text style={styles.section}>Sales Trend</Text>

            <ScrollView horizontal>
              <BarChart
                data={
                  {labels: days.map((d, i) =>
  i % 7 === 0 ? formatLabel(d) : ""
)
                  ,
                  datasets: [{ data: trend }]
                }}
                width={Math.max(screenWidth, days.length * 32)}
                height={180}
                verticalLabelRotation={0}
                horizontalLabelRotation={0}
                
                chartConfig={chartConfig}
              />
            </ScrollView>
          </View>

          {/* PROFIT TREND */}
          <View style={styles.card}>
            <Text style={styles.section}>Profit Trend</Text>

            <ScrollView horizontal>
              <BarChart
                data={{
                  labels: days.map((d, i) =>
  i % 7 === 0 ? formatLabel(d) : ""
),
                  datasets: [{ data: profitTrend }]
                }}
                width={Math.max(screenWidth, days.length * 32)}
                height={180}
                verticalLabelRotation={0}
horizontalLabelRotation={0}
                yAxisLabel="₹"
                chartConfig={chartConfig}
              />
            </ScrollView>
          </View>

          {/* PIE */}
          <View style={styles.card}>
            <Text style={styles.section}>Device Distribution</Text>

            <PieChart
              data={pieData}
              width={screenWidth - 32}
              height={180}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
            />
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
  labelColor: () => "#475569",

  propsForLabels: {
  fontSize: 10
}
};

const styles = StyleSheet.create({
  headerRow: { margin: 16 },
  title: { fontSize: 24, fontWeight: "800" },
  monthRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  monthText: { fontSize: 16, fontWeight: "600", marginHorizontal: 10 },
  monthBtn: { fontSize: 22, paddingHorizontal: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16
  },
  glassCard: {
    width: 100,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
shadowOpacity: 0.08,
shadowRadius: 8,
elevation: 4
  },
  statValue: { fontSize: 18, fontWeight: "700" },
  statLabel: { fontSize: 12 },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff"
  },
  section: { marginBottom: 10, fontWeight: "600" }
});