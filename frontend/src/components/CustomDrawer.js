import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useStore } from "@store/useStore";

export default function CustomDrawer({ navigation }) {
  const { user, logout } = useStore();

  const navigateTo = (screen) => {
    navigation.navigate(screen);
    navigation.closeDrawer(); // ✅ FIX
  };

  return (
    <View style={styles.container}>

      {/* PROFILE */}
      <TouchableOpacity
        style={styles.profileCard}
        onPress={() => navigateTo("Profile")}
      >
        <View style={styles.avatar} />
        <Text style={styles.name}>
          {user?.email || "Admin"}
        </Text>
      </TouchableOpacity>

      {/* MENU */}
      <TouchableOpacity onPress={() => navigateTo("Reports")}>
        <Text style={styles.menuItem}>Reports</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigateTo("ActivityLogs")}>
        <Text style={styles.menuItem}>Activity Logs</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigateTo("Settings")}>
        <Text style={styles.menuItem}>Settings</Text>
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity
        onPress={() => {
          logout();
          navigation.replace("Login"); // ok if Login is root
        }}
      >
        <Text style={[styles.menuItem, styles.logout]}>
          Logout
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },

  profileCard: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 15
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1E4E79",
    marginBottom: 10
  },

  name: {
    fontWeight: "600",
    fontSize: 16
  },

  menuItem: {
    fontSize: 16,
    paddingVertical: 12
  },

  logout: {
    color: "red",
    marginTop: 20
  }
});