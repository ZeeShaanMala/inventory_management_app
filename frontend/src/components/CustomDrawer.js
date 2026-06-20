import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useStore } from "@store/useStore";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
        {
          user?.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatar} />
          )
        }
        <Text style={styles.name}>
          {user?.name || "Admin"}
        </Text>
        <Text style={styles.email}>
  {user?.email}
</Text>
      </TouchableOpacity>

      {/* MENU */}
      <TouchableOpacity
  style={styles.menuButton}
  onPress={() => navigateTo("Reports")}
>

  <Icon
    name="file-chart"
    size={20}
    color="#1E293B"
  />

  <Text style={styles.menuItem}>
    Reports
  </Text>

</TouchableOpacity>

      <TouchableOpacity
  style={styles.menuButton}
  onPress={() => navigateTo("ActivityLogs")}
>

  <Icon
    name="history"
    size={20}
    color="#1E293B"
  />

  <Text style={styles.menuItem}>
    Activity Logs
  </Text>

</TouchableOpacity>
      <TouchableOpacity
  style={styles.menuButton}
  onPress={() => navigateTo("Settings")}
>

  <Icon
    name="cog"
    size={20}
    color="#1E293B"
  />

  <Text style={styles.menuItem}>
    Settings
  </Text>

</TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity
  style={styles.menuButton}
  onPress={() => {
    logout();
    navigation.replace("Login");
  }}
>

  <Icon
    name="logout"
    size={20}
    color="#DC2626"
  />

  <Text style={[styles.menuItem, styles.logout]}>
    Logout
  </Text>


</TouchableOpacity>
<View style={styles.footer}>

  <Text style={styles.version}>
    Inventory Management System
  </Text>

  <Text style={styles.versionSub}>
    Version 1.0.0
  </Text>

</View>
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
  marginBottom: 30,
  backgroundColor: "#F8FAFC",
  padding: 18,
  borderRadius: 18,

  elevation: 2,
  shadowColor: "#000",
  shadowOpacity: 0.04,
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 2
  }
},

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#1E4E79",
    marginBottom: 10
  },

  name: {
    fontWeight: "600",
    fontSize: 16
  },
  email: {
  fontSize: 12,
  color: "#64748B",
  marginTop: 2
},
menuButton: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 14,
  paddingHorizontal: 10,
  borderRadius: 12
},

  menuItem: {
  fontSize: 15,
  marginLeft: 14,
  fontWeight: "500",
  color: "#1E293B"
},

  logout: {
  color: "#DC2626"
},

footer: {
  marginTop: "auto",
  alignItems: "center",
  paddingBottom: 10
},

version: {
  color: "#64748B",
  fontSize: 12,
  fontWeight: "600"
},

versionSub: {
  color: "#94A3B8",
  fontSize: 11,
  marginTop: 2
}
});