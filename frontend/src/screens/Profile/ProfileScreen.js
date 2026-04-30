import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { useStore } from "@store/useStore";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useStore();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleLogout = () => {
    logout();
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>
            Manage your account information
          </Text>
        </View>

        {/* ACCOUNT */}
        <Text style={styles.section}>ACCOUNT</Text>

        <View style={styles.card}>

          {/* PROFILE INFO */}
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("ProfileInfo")}
          >
            <Icon name="account" size={18} />
            <Text style={styles.itemText}>Profile Information</Text>
            <Icon name="chevron-right" size={18} />
          </TouchableOpacity>

          {/* EMAIL */}
          <View style={styles.infoBox}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>
              {user?.email || "Not available"}
            </Text>
          </View>

          {/* PASSWORD */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ChangePassword")}
            style={styles.item}
          >
            <Icon name="lock" size={18} />
            <Text style={styles.itemText}>Change Password</Text>
            <Icon name="chevron-right" size={18} />
          </TouchableOpacity>

        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- STYLES ----------

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F4F6F8"
  },

  header: {
    padding: 16
  },

  title: {
    fontSize: 22,
    fontWeight: "700"
  },

  subtitle: {
    color: "#64748B",
    marginTop: 4
  },

  section: {
    marginLeft: 16,
    marginTop: 10,
    fontSize: 12,
    color: "#64748B"
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14
  },

  itemText: {
    flex: 1,
    marginLeft: 10
  },

  infoBox: {
    paddingHorizontal: 14,
    paddingBottom: 10
  },

  label: {
    fontSize: 12,
    color: "#64748B"
  },

  value: {
    fontSize: 15,
    fontWeight: "600"
  },

  logoutBtn: {
    backgroundColor: "#DC2626",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center"
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600"
  }
});