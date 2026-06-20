import React, { useState } from "react";
import {
  View,
  Alert,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity
} from "react-native";
import LoadingOverlay from "@components/LoadingOverlay";
import { Picker } from "@react-native-picker/picker";
import PrimaryButton from "../../components/PrimaryButton";
import { useStore } from "@store/useStore";
import { STATUS } from "@utils/constants";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function AssignDevice({ navigation, route }) {  const devices = useStore(state => state.devices);
  const parties = useStore(state => state.parties);
  const isBulk = route?.params?.bulk;
  // ✅ IMPORTANT: use bulk function
  const assignDevices = useStore(state => state.assignDevices);
  const { device } = route.params;
  const [selectedImei, setSelectedImei] = useState(device?.imei || "");
  const assignDevice = useStore(state => state.assignDevice);
  const [quantity, setQuantity] = useState("");
  const [selectedParty, setSelectedParty] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Available devices (stock)
  const availableDevices = devices.filter(
d => d?.status === "IN_STOCK"
  );

  // ✅ Assign Handler
  const handleAssign = async () => {

  if (!selectedParty) {
    return Alert.alert("Error", "Select party");
  }

  if (isBulk) {
    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      return Alert.alert("Error", "Enter valid quantity");
    }

    if (availableDevices.length < qty) {
      return Alert.alert("Error", "Not enough devices");
    }
  } else {
    if (!selectedImei) {
      return Alert.alert("Error", "Select device");
    }
  }

  setLoading(true);

  try {
    // ⏳ ADD THIS LINE (IMPORTANT)
    await new Promise(resolve => setTimeout(resolve, 700));

    if (isBulk) {

  await assignDevices(
    selectedParty,
    Number(quantity)
  );

  Alert.alert(
    "Success",
    `${quantity} devices assigned`
  );

} else {

  await assignDevice(
    selectedImei,
    selectedParty
  );

  Alert.alert(
    "Success",
    "Device assigned successfully"
  );

}
    navigation.goBack();

  } catch (e) {
    Alert.alert("Error", e.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <Text style={styles.title}>
          {isBulk ? "Bulk Assignment" : "Assign Device"}
        </Text>       
        <Text style={styles.subtitle}>
  {isBulk
    ? "Assign multiple GPS units from stock"
    : "Assign a device to a party"}
</Text>

        {/* CARD */}
        <View style={styles.card}>

          {/* HEADER */}
          <View style={styles.cardHeader}>
            <Icon name="chip" size={18} color="#1E3A8A" />
            <Text style={styles.cardTitle}>Assignment Details</Text>
          </View>

          {isBulk ? (
  <>
    {/* BULK MODE */}

    <Text style={styles.label}>Number of Devices</Text>
    <TextInput
      style={styles.inputBox}
      placeholder="Enter quantity (e.g. 25)"
      keyboardType="numeric"
      value={quantity}
      onChangeText={setQuantity}
    />

    <Text style={styles.availableText}>
      Available Devices: {availableDevices.length}
    </Text>
  </>
) : (
  <>
    {/* SINGLE MODE */}

    <Text style={styles.label}>Select Device</Text>
    <View style={styles.pickerBox}>
      <Picker
        selectedValue={selectedImei}
        onValueChange={setSelectedImei}
      >
        <Picker.Item label="Select device" value="" />
        {availableDevices.map(device => (
          <Picker.Item
            key={device.imei}
            label={device.imei}
            value={device.imei}
          />
        ))}
      </Picker>
    </View>
  </>
)}
          {/* PARTY */}
          <Text style={styles.label}>Assign To (Party)</Text>
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={selectedParty}
              onValueChange={setSelectedParty}
            >
              <Picker.Item label="Select recipient" value="" />
              {parties.map(party => (
                <Picker.Item
                  key={party.id}
                  label={party.name}
                  value={party.id}
                />
              ))}
            </Picker>
          </View>

          {/* DATE */}
          <Text style={styles.label}>Assignment Date</Text>
          <View style={styles.inputBox}>
            <Text style={styles.inputText}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>

          {/* NOTES */}
          <Text style={styles.label}>Assignment Notes</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter notes..."
            placeholderTextColor="#94A3B8"
            multiline
            value={notes}
            onChangeText={setNotes}
          />

                      {/* BUTTONS */}
                      <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
            <Text style={{ fontWeight: "500" }}>Cancel</Text>
          </TouchableOpacity>

          <PrimaryButton
          title={
  isBulk
    ? "Assign Devices"
    : "Assign Device"
}
          icon="✔️"
          onPress={handleAssign}
          disabled={
          loading ||
          !selectedParty ||
          (!isBulk && !selectedImei) ||
          (isBulk && !quantity)
        }
        />

        </View>

        {/* INFO */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Automated Logging</Text>
          <Text style={styles.infoText}>
            This action will be recorded in lifecycle history.
          </Text>
        </View>

      </ScrollView>
      <LoadingOverlay
  visible={loading}
  text={
    isBulk
      ? "Assigning devices..."
      : "Assigning device..."
  }
/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F1F5F9"
  },

  container: {
    padding: 20
  },

  title: {
    fontSize: 22,
    fontWeight: "700"
  },

  subtitle: {
    color: "#64748B",
    marginBottom: 16
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },

  cardTitle: {
    marginLeft: 6,
    fontWeight: "600"
  },

  label: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 12
  },

  pickerBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    marginTop: 6
  },

  inputBox: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },

  inputText: {
    color: "#0F172A"
  },

  textArea: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    height: 80,
    marginTop: 6,
    textAlignVertical: "top"
  },

  cancelBtn: {
    backgroundColor: "#E2E8F0",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 10
  },

  infoCard: {
    backgroundColor: "#E0F2FE",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },

  infoTitle: {
    fontWeight: "600"
  },

  infoText: {
    fontSize: 12,
    color: "#475569"
  },

  availableText: {
    marginTop: 6,
    color: "#64748B",
    fontSize: 12
  }
});