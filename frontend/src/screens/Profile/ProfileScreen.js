import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image
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


        {/* PROFILE HERO */}
        <View style={styles.profileHero}>

  <View style={styles.avatarLarge}>

    {
      user?.avatar ? (

        <Image
          source={{ uri: user.avatar }}
          style={styles.avatarImage}
        />

      ) : (

        <Icon
          name="account"
          size={50}
          color="#fff"
        />

      )
    }

  </View>

  <Text style={styles.heroName}>
    {user?.name || "Administrator"}
  </Text>


  <Text style={styles.heroRole}>
    Inventory Administrator
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

        {/* APP VERSION */}
        <Text style={styles.version}>
          Inventory Management System v1.0.0
</Text>

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

  profileHero: {
  alignItems: "center",
  paddingVertical: 25,
  backgroundColor: "#fff",
  margin: 16,
  borderRadius: 20,
  elevation: 3,
shadowColor: "#000",
shadowOpacity: 0.05,
shadowRadius: 10,
shadowOffset: {
  width: 0,
  height: 3
},
},

avatarLarge: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: "#1E4E79",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden"
},

avatarImage: {
  width: "100%",
  height: "100%"
},

heroName: {
  fontSize: 20,
  fontWeight: "700",
  marginTop: 12
},



heroRole: {
  marginTop: 6,
  fontSize: 12,
  color: "#2563EB",
  fontWeight: "600"
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
    borderRadius: 12,
    elevation: 2,
shadowColor: "#000",
shadowOpacity: 0.04,
shadowRadius: 8,
shadowOffset: {
  width: 0,
  height: 2
},
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
  version: {
  textAlign: "center",
  color: "#94A3B8",
  fontSize: 12,
  marginBottom: 20
},

  logoutBtn: {
    backgroundColor: "#ff6060",
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