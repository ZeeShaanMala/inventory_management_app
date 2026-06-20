import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  Alert
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useStore } from "@store/useStore";
import { useLayoutEffect } from "react";

export default function PartyList({ navigation, route }) {
  useLayoutEffect(() => {
  navigation.setOptions({
    headerShown: false
  });
}, [navigation]);
  const { parties, deleteParty } = useStore();

  const renderItem = ({ item, index }) => {
    const translateY = new Animated.Value(20);
    const opacity = new Animated.Value(0);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay: index * 80,
        useNativeDriver: true
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 80,
        useNativeDriver: true
      })
    ]).start();

    

    const renderRightActions = () => (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            "Delete Party",
            "Are you sure you want to delete this party?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => deleteParty(item.id)
              }
            ]
          );
        }}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );

    return (
      <Swipeable
  renderRightActions={renderRightActions}
  friction={2}
  overshootRight={false}
  rightThreshold={40}
>
        <Animated.View style={{ transform: [{ translateY }], opacity }}>
          
          <View style={styles.card}>

            {/* Assign Flow */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {

  if (route.params?.device) {

    navigation.navigate("AssignDevice", {
      device: route.params.device,
      party: item
    });

  } else {

    navigation.navigate(
      "PartyDetails",
      { party: item }
    );

  }

}}
            >
              <Text style={styles.name}>{item.name}</Text>

              <View style={styles.row}>
  <Text style={styles.icon}>📞</Text>
  <Text style={styles.text}>
    {item.phone}
  </Text>
</View>

<View style={styles.row}>
  <Text style={styles.icon}>📍</Text>
  <Text style={styles.text}>
    {item.city}
  </Text>
</View>

<View style={styles.row}>
  <Text style={styles.icon}>🏢</Text>
  <Text style={styles.text}>
    {item.type}
  </Text>
</View>
            </TouchableOpacity>

            {/* Edit Button */}
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate("EditParty", { party: item })
              }
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>

          </View>

        </Animated.View>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Parties</Text>
          <Text style={styles.subtitle}>
            Manage all sellers & customers
          </Text>
        </View>

        {/* Add Party */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddParty")}
        >
          <Text style={styles.addButtonText}>+ Add Party</Text>
        </TouchableOpacity>

        {/* List */}
        {parties.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No Parties Found</Text>
            <Text style={styles.emptyText}>
              Add your first party to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={parties}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 20,
    paddingTop: 10
  },

  header: {
    marginBottom: 15
  },

  title: {
    fontSize: 24,
    fontWeight: "700"
  },

  subtitle: {
    color: "#64748B",
    marginTop: 2
  },

  addButton: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15
  },

  addButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600"
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 1
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6
  },

  row: {
    flexDirection: "row",
    alignItems: "center"
  },

  icon: {
    fontSize: 14,
    marginRight: 6
  },

  text: {
    color: "#475569",
    fontSize: 13
  },

  editButton: {
    marginTop: 10,
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 8
  },

  editText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0F172A"
  },

  deleteButton: {
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 16,
    marginBottom: 12
  },

  deleteText: {
    color: "#fff",
    fontWeight: "600"
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  emptyIcon: {
    fontSize: 40,
    marginBottom: 10
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5
  },

  emptyText: {
    color: "#94A3B8",
    fontSize: 13
  }
});