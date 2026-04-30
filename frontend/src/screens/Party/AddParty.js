import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import InputFields from "../../components/InputFields";
import PrimaryButton from "../../components/PrimaryButton";
import { useStore } from "@store/useStore";

const AddParty = ({ navigation }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
const addParty = useStore(state => state.addParty);
const handleAddParty = () => {
    // ✅ VALIDATIONS
    if (!name || name.trim().length < 3) {
      return Alert.alert("Error", "Enter valid name (min 3 characters)");
    }

    if (!/^\d{10}$/.test(mobile)) {
      return Alert.alert("Error", "Enter valid 10-digit mobile number");
    }

    if (!city || city.trim().length < 3) {
      return Alert.alert("Error", "Enter valid city name");
    }

    if (!type || type.trim().length < 3) {
      return Alert.alert("Error", "Enter valid type (Seller/Customer)");
    }


  // ✅ SAVE TO STORE
  addParty({
    name,
    phone: mobile,   // important: match store field
    city,
    type
  });

  // ✅ RESET FORM
  setName("");
  setMobile("");
  setCity("");
  setType("");

  // ✅ NAVIGATE BACK (instant)
  navigation.goBack();
};

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : null}
  style={styles.container}
>
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 40 }}
    keyboardShouldPersistTaps="handled"
  >

    {/* Header */}
    <View style={styles.header}>
      <Text style={styles.title}>Add New Party</Text>
      <Text style={styles.subtitle}>
        Enter party details below
      </Text>
    </View>

    {/* Card */}
    <View style={styles.card}>

      <View style={styles.group}>
        <Text style={styles.label}>Party Name</Text>
        <InputFields
          placeholder="Enter name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Mobile Number</Text>
        <InputFields
          placeholder="Enter mobile number"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>City</Text>
        <InputFields
          placeholder="Enter city"
          value={city}
          onChangeText={setCity}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Type</Text>
        <InputFields
          placeholder="Seller / Customer"
          value={type}
          onChangeText={setType}
        />
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Add Party"
          icon="➕"
          onPress={handleAddParty}
        />
      </View>

    </View>

  </ScrollView>
</KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddParty;

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
    fontWeight: "700",
    color: "#0F172A"
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

  group: {
    marginBottom: 12
  },

  label: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 6
  },

  buttonContainer: {
    marginTop: 20
  }
});