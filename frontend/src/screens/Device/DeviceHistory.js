import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList
} from "react-native";

const STATUS_CONFIG = {
  created: {
    color: "#2563EB",
    bg: "#DBEAFE",
    icon: "📦"
  },
  assigned: {
    color: "#7C3AED",
    bg: "#EDE9FE",
    icon: "👤"
  },
  Activated: {
    color: "#F59E0B",
    bg: "#FEF3C7",
    icon: "🛠️"
  },
  sold: {
    color: "#10B981",
    bg: "#D1FAE5",
    icon: "✅"
  }
};

export default function DeviceHistory({ route }) {
  const { device } = route.params;

  const history = device.history || [];

  const renderItem = ({ item, index }) => {
  const isLast = index === history.length - 1;

  const config = STATUS_CONFIG[item.action] || STATUS_CONFIG.created;

  return (
    <View style={styles.row}>

      {/* Timeline Rail */}
      <View style={styles.rail}>
        <View style={[styles.dot, { backgroundColor: config.color }]}>
          <Text style={styles.dotIcon}>{config.icon}</Text>
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Card */}
      <View style={[styles.card, { borderLeftColor: config.color }]}>
        
        <View style={styles.top}>
          <Text style={styles.title}>{item.label}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>

        {item.note ? (
          <Text style={styles.note}>{item.note}</Text>
        ) : null}

        <Text style={styles.meta}>
          {item.time} • {item.by}
        </Text>

      </View>
    </View>
  );
};

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Device History</Text>
          <Text style={styles.sub}>
            IMEI: {device.imei}
          </Text>
        </View>

        {/* Timeline */}
        {history.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No history available
            </Text>
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
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

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A"
  },

  sub: {
    color: "#64748B",
    marginTop: 4
  },

  row: {
    flexDirection: "row",
    marginBottom: 20
  },

  rail: {
    width: 30,
    alignItems: "center"
  },

  dot: {
  width: 28,
  height: 28,
  borderRadius: 14,
  justifyContent: "center",
  alignItems: "center"
},
  line: {
  width: 2,
  flex: 1,
  backgroundColor: "#E2E8F0",
  marginTop: 4
},

  card: {
  flex: 1,
  backgroundColor: "#FFFFFF",
  padding: 14,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#E2E8F0",
  borderLeftWidth: 4
},
  top: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  title: {
  fontWeight: "700",
  color: "#0F172A"
},


  date: {
    fontSize: 12,
    color: "#64748B"
  },

  note: {
  marginTop: 6,
  color: "#475569"
},

 meta: {
  marginTop: 6,
  fontSize: 12,
  color: "#94A3B8"
},

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  emptyText: {
    color: "#94A3B8"
  }
});