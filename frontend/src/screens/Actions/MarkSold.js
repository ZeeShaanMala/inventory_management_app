import React, { useState } from "react";
import {
  View,
  Alert,
  StyleSheet,
  Text,
  SafeAreaView
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import PrimaryButton from "../../components/PrimaryButton";
import { useStore } from "@store/useStore";
import { STATUS } from "@utils/constants";
import InputFields from "@components/InputFields";

export default function MarkSold({ navigation, route }) {

  const devices = useStore(state => state.devices);
  const markAsSold = useStore(state => state.markAsSold);

  const [sellingPrice, setSellingPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [selectedImei, setSelectedImei] = useState("");

  const ActivatedDevices = devices.filter(
    d => d.status === STATUS.ACTIVATED
  );

  const handleSold = () => {
    if (!selectedImei) {
      return Alert.alert("Error", "Select IMEI");
    }

    if (!sellingPrice || !costPrice) {
      return Alert.alert("Error", "Enter both prices");
    }

    // 🔥 ADDED VALIDATION (THIS WAS MISSING)
    if (Number(costPrice) > Number(sellingPrice)) {
      return Alert.alert(
        "Invalid Input",
        "Cost price cannot be greater than selling price"
      );
    }

    try {
      markAsSold(selectedImei, {
        sellingPrice: Number(sellingPrice),
        costPrice: Number(costPrice)
      });

      Alert.alert("Success", "Device marked as SOLD");

      navigation.goBack();

    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mark as Sold</Text>
          <Text style={styles.subtitle}>
            Complete the device lifecycle
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>

          {/* Picker */}
          <Text style={styles.label}>Select Activated Device</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={selectedImei}
              onValueChange={setSelectedImei}
            >
              <Picker.Item label="Select IMEI" value="" />
              {ActivatedDevices.map(device => (
                <Picker.Item
                  key={device.imei}
                  label={device.imei}
                  value={device.imei}
                />
              ))}
            </Picker>
          </View>

          {/* Price Inputs */}
          <Text style={styles.label}>Selling Price</Text>
          <InputFields
            placeholder="Enter selling price"
            value={sellingPrice}
            onChangeText={setSellingPrice}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Cost Price</Text>
          <InputFields
            placeholder="Enter cost price"
            value={costPrice}
            onChangeText={setCostPrice}
            keyboardType="numeric"
          />

          {/* Button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton
              title="Mark as Sold"
              icon="✅"
              onPress={handleSold}
            />
          </View>

        </View>

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