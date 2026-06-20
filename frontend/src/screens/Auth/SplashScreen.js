import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "@utils/constants";
import { useStore } from "@store/useStore";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const loadData = useStore(state => state.loadData);
const token = useStore(state => state.token);

  useEffect(() => {

  const initialize = async () => {

    // LOAD STORED DATA
    await useStore
  .getState()
  .loadData();

    // START ANIMATION
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true
      })
    ]).start();

    // WAIT FOR SPLASH
    setTimeout(() => {

      const currentToken =
        useStore.getState().token;

      navigation.replace(
        currentToken
          ? "MainApp"
          : "Login"
      );

    }, 2500);

  };

  initialize();

}, []);

  return (
    <SafeAreaView style={styles.container}>
      
      {/* CENTER CONTENT */}
      <Animated.View
        style={[
          styles.center,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >

        {/* ICON */}
        <View style={styles.iconBox}>
          <Icon name="satellite-variant" size={36} color="#1E4E79" />
        </View>

        {/* TITLE */}
        <Text style={styles.logo}>GPS Inventory</Text>
        <Text style={styles.tagline}>Operational Precision</Text>

        {/* LOADER */}
        <View style={styles.loader}>
          <ActivityIndicator size="small" color="#1E4E79" />
          <Text style={styles.loadingText}>
            Initializing secure connection...
          </Text>
        </View>

      </Animated.View>

      {/* FOOTER */}
      <Text style={styles.footer}>
        © 2024 Precision Systems Global. All rights reserved.
      </Text>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    justifyContent: "space-between",
    paddingVertical: 40
  },

  center: {
    alignItems: "center",
    marginTop: 120
  },

  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 3
  },

  logo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B"
  },

  tagline: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    letterSpacing: 1
  },

  loader: {
    marginTop: 30,
    alignItems: "center"
  },

  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: "#64748B"
  },

  footer: {
    textAlign: "center",
    fontSize: 10,
    color: "#94A3B8"
  }
});