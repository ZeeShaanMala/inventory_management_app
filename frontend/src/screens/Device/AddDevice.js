import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import InputFields from "../../components/InputFields";
import PrimaryButton from "../../components/PrimaryButton";
import { api } from "@services/api";
import { useLayoutEffect } from "react";
import { useStore } from "@store/useStore";
import LoadingOverlay from "@components/LoadingOverlay";

export default function AddDevice({ navigation, route }) {

  const addDevice = useStore(state => state.addDevice);
  const editData = route?.params?.editData;
  const isEdit = !!editData;
  const isBulk = route?.params?.bulk;
  const [imei, setImei] = useState("");
  const [model, setModel] = useState("");
  const [alias, setAlias] = useState("");
  const [sim, setSim] = useState("");
  const [notes, setNotes] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [startImei, setStartImei] = useState("");
  const [quantity, setQuantity] = useState("");
  const updateDevice = useStore(state => state.updateDevice);
  const addDevicesBulk = useStore(state => state.addDevicesBulk);


  useLayoutEffect(() => {
  navigation.setOptions({
    headerShown: false
  });
}, [navigation]);

  // ✅ Prefill when editing
  useEffect(() => {
    if (editData) {
      setImei(editData.imei || "");
      setModel(editData.model || "");
      setAlias(editData.alias || "");
      setSim(editData.sim_number || "");
      setCostPrice(editData.cost_price?.toString() || "");
      setNotes(editData.notes || "");
    }
  }, [editData]);

  const handleBulkAdd = () => {
  if (!startImei || !quantity) {
    return Alert.alert("Error", "Enter all fields");
  }

  addDevicesBulk(startImei, Number(quantity));

  Alert.alert("Success", `${quantity} devices added`);
  navigation.goBack();
};

  const handleAdd = async () => {
    if (!imei || !model) {
      return Alert.alert("Error", "IMEI and Model are required");
    }

    if (imei.length < 10) {
      return Alert.alert("Error", "Enter valid IMEI");
    }

    setLoading(true);

   try {

  if (isEdit) {

    const updatedDevice = {
      ...editData,
      imei,
      model,
      sim_number: sim,
      alias,
      notes,
      cost_price: Number(costPrice || 0)
    };

    await updateDevice(
      updatedDevice.imei,
      updatedDevice
    );

    Alert.alert(
      "Success",
      "Device updated successfully"
    );

  } else {

    const newDevice = {
      imei,
      model,
      sim_number: sim,
      alias,
      notes,
      cost_price: Number(costPrice || 0),
      status: "IN_STOCK"
    };

    await addDevice(newDevice);

    Alert.alert(
      "Success",
      "Device added successfully"
    );

    setImei("");
    setModel("");
    setAlias("");
    setSim("");
    setNotes("");
  }

  navigation.goBack();

} catch (e) {

  Alert.alert(
    "Error",
    e.message
  );

} finally {

  setLoading(false);

}};

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>
            {isBulk ? "Bulk Add Devices" : isEdit ? "Edit Device" : "Add Device"}
</Text>
            <Text style={styles.subtitle}>
              Enter device details to register
            </Text>
          </View>

         {isBulk && (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>Bulk Add Devices</Text>

    <Text style={styles.label}>Start IMEI</Text>
    <InputFields
      placeholder="Enter starting IMEI"
      value={startImei}
      onChangeText={setStartImei}
      keyboardType="numeric"
    />

    <Text style={styles.label}>Quantity</Text>
    <InputFields
      placeholder="Enter number of devices"
      value={quantity}
      onChangeText={setQuantity}
      keyboardType="numeric"
    />
  </View>
)} 
{!isBulk && (
  <>
    {/* GENERAL INFO */}
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>General Information</Text>

      <Text style={styles.label}>Device Name / Alias</Text>
      <InputFields
        placeholder="e.g. North Tracker"
        value={alias}
        onChangeText={setAlias}
      />

      <Text style={styles.label}>Device Model *</Text>
      <InputFields
        placeholder="e.g. AIS140"
        value={model}
        onChangeText={setModel}
      />
    </View>
  </>
)}

          {/* IDENTIFIERS */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Hardware Identifiers</Text>

            <Text style={styles.label}>IMEI Number *</Text>
            <InputFields
              placeholder="15-digit identifier"
              value={imei}
              onChangeText={setImei}
              keyboardType="numeric"
            />

            <Text style={styles.label}>SIM Number</Text>
            <InputFields
              placeholder="Enter SIM number"
              value={sim}
              onChangeText={setSim}
            />
          </View>

          {/* NOTES */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>

            <InputFields
              placeholder="Optional notes..."
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </View>

          {/* BUTTON */}
          <View style={styles.buttonContainer}>

  <PrimaryButton
    title={
      isBulk
        ? "Add Bulk Devices"
        : isEdit
        ? "Update Device"
        : "Save Device"
    }
    onPress={
      isBulk
        ? handleBulkAdd
        : handleAdd
    }
    disabled={loading}
  />

</View>

        </ScrollView>
      </KeyboardAvoidingView>
      <LoadingOverlay
  visible={loading}
  text={
    isBulk
      ? "Adding devices..."
      : isEdit
      ? "Updating device..."
      : "Saving device..."
  }
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
    padding: 20,
    paddingBottom: 40
  },

  header: {
    marginBottom: 20
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A"
  },

  subtitle: {
    color: "#64748B",
    marginTop: 4
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10
  },

  label: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 6,
    marginTop: 10
  },

  buttonContainer: {
    marginTop: 10
  }
});