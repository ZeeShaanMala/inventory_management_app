import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from "react-native";

import { useStore } from "@store/useStore";

export default function EditDevice({ route, navigation }) {
const { device } = route.params;
const { devices , updateDevice } = useStore();


  const [model, setModel] = useState(device?.model || "");
  const [simNumber, setSimNumber] = useState(device?.simNumber || "");

  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Device not found</Text>
      </SafeAreaView>
    );
  }

 const handleSave = async () => {
  await updateDevice(device.imei, {
    model,
    simNumber
  });

  Alert.alert("Success", "Device updated");
  navigation.goBack();
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit Device</Text>

      <TextInput
        placeholder="Model"
        value={model}
        onChangeText={setModel}
        style={styles.input}
      />

      <TextInput
        placeholder="SIM Number"
        value={simNumber}
        onChangeText={setSimNumber}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAFC"
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center"
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600"
  }
});