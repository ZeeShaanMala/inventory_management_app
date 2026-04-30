import React, { useEffect, useState } from "react";
import {
  View,
  Alert,
  StyleSheet,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import InputFields from "../../components/InputFields";
import PrimaryButton from "../../components/PrimaryButton";
import { useStore } from "@store/useStore";
import { STATUS } from "@utils/constants";

export default function ActivateDevice({ navigation, route }) {
  const devices = useStore(state => state.devices);
  const activateDevice = useStore(state => state.activateDevice); // ✅ FIX

  const [selectedImei, setSelectedImei] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [customer, setCustomer] = useState("");
  const [notes, setNotes] = useState("");

  const assignedDevices = devices.filter(
    d => d?.status === STATUS.ASSIGNED
  );

  const imeiFromRoute = route?.params?.imei;

  useEffect(() => {
    if (imeiFromRoute) {
      setSelectedImei(imeiFromRoute);
    }
  }, []);

  // ✅ RENAMED + LOGIC FIXED
  const handleActivate = () => {
    if (!selectedImei) {
      return Alert.alert("Error", "Select device");
    }

    try {
      activateDevice(selectedImei, {
        vehicleNumber: vehicle || null,
        customerName: customer || null,
        notes: notes || "Activated via IMEI"
      });

      Alert.alert("Success", "Device Activated");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.container}
      >

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Activate Device</Text>
          <Text style={styles.subtitle}>
            Activate device using IMEI
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>

          {/* Picker */}
          <Text style={styles.label}>Select Assigned Device</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={selectedImei}
              onValueChange={setSelectedImei}
            >
              <Picker.Item label="Select IMEI" value="" />
              {assignedDevices.map(device => (
                <Picker.Item
                  key={device.imei}
                  label={device.imei}
                  value={device.imei}
                />
              ))}
            </Picker>
          </View>

          {/* Optional Vehicle */}
          <Text style={styles.label}>Vehicle Number (Optional)</Text>
          <InputFields
            placeholder="Enter vehicle number (if available)"
            value={vehicle}
            onChangeText={setVehicle}
          />

          
          {/* Button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Activate Device"
              
              onPress={handleActivate}
            />
          </View>

        </View>

      </KeyboardAvoidingView>
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
  title: {
    fontSize: 24,
    fontWeight: "700"
  },
  subtitle: {
    color: "#64748B",
    marginTop: 4
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  label: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 6,
    marginTop: 10
  },
  pickerBox: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    marginBottom: 10
  },
  buttonContainer: {
    marginTop: 20
  }
});