import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import LoadingOverlay from "@components/LoadingOverlay";

import InputFields from "../../components/InputFields";
import PrimaryButton from "../../components/PrimaryButton";
import { COLORS } from "@utils/constants";
import { useStore } from "@store/useStore";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useStore();

  const handleLogin = async () => {

  if (!email || !password) {
    return Alert.alert(
      "Error",
      "Please fill all fields"
    );
  }

  try {

    setLoading(true);

    // ================= REAL LOGIN =================
    await login(
      email,
      password
    );
    await useStore
  .getState()
  .loadData();
    await new Promise(resolve => setTimeout(resolve, 1000));


    Alert.alert(
      "Success",
      "Login successful"
    );

    navigation.replace("MainApp");

  } catch (error) {

    Alert.alert(
      "Error",
      error.message || "Login failed"
    );

  } finally {

    setLoading(false);

  }

};
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.container}
      >

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.iconBox}>
                    <Icon name="satellite-variant" size={36} color="#1E4E79" />
                  </View>

          <Text style={styles.title}>GPS Inventory</Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>

          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Please sign in to continue
          </Text>

          {/* EMAIL */}
          <Text style={styles.label}>Email Address</Text>
          <InputFields
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
          />

          {/* PASSWORD */}
          <Text style={styles.label}>Password</Text>
          <InputFields
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            rightIcon={
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="gray"
              />
            }
            onRightIconPress={() =>
              setShowPassword(prev => !prev)
            }
          />

          {/* BUTTON */}
          <View style={styles.buttonContainer}>

  <PrimaryButton
    title="Sign In"
    onPress={handleLogin}
    disabled={loading}
  />

</View>

        </View>

      </KeyboardAvoidingView>
      <LoadingOverlay
  visible={loading}
  text="Signing in..."
/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F4F6F8"
  },

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20
  },

  header: {
    alignItems: "center",
    marginBottom: 30
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

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B"
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    elevation: 2
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700"
  },

  subtitle: {
    color: "#64748B",
    marginTop: 4,
    marginBottom: 15
  },

  label: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 6,
    marginTop: 10
  },

  buttonContainer: {
    marginTop: 20
  }
});