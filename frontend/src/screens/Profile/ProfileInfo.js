import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useStore } from "@store/useStore";


export default function ProfileInfo({ navigation }) {
  const { user, updateUser } = useStore();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [company, setCompany] = useState(user?.company || "");
  const [address, setAddress] = useState(user?.address || "");

  const handleSave = () => {
    updateUser({ name, email, phone, company, address });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <Text style={styles.title}>Edit Profile</Text>

        {/* AVATAR */}
        <View style={styles.avatarBox}>
          <View style={styles.avatar}>
            <Icon name="account" size={40} color="#fff" />
          </View>
          <Text style={styles.avatarText}>Update avatar</Text>
        </View>

        {/* INPUTS */}
        <Input label="FULL NAME" value={name} onChange={setName} />
        <Input label="EMAIL ADDRESS" value={email} onChange={setEmail} />
        <Input label="PHONE NUMBER" value={phone} onChange={setPhone} />

        <Input
          label="COMPANY / BUSINESS NAME"
          value={company}
          onChange={setCompany}
        />

        <Input
          label="OFFICE ADDRESS"
          value={address}
          onChange={setAddress}
          multiline
        />

        {/* BUTTONS */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// -------- INPUT COMPONENT --------
const Input = ({ label, value, onChange, multiline }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && { height: 80 }]}
      value={value}
      onChangeText={onChange}
      multiline={multiline}
    />
  </View>
);

// -------- STYLES --------
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F6F8" },
  container: { padding: 20, paddingBottom: 40 },

  title: { fontSize: 20, fontWeight: "700", marginBottom: 20 },

  avatarBox: {
    alignItems: "center",
    marginBottom: 20
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#94A3B8",
    justifyContent: "center",
    alignItems: "center"
  },

  avatarText: {
    marginTop: 8,
    color: "#64748B",
    fontSize: 12
  },

  inputGroup: { marginBottom: 15 },

  label: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 4
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12
  },

  saveBtn: {
    backgroundColor: "#1E3A8A",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },

  saveText: {
    color: "#fff",
    fontWeight: "600"
  },

  cancelBtn: {
    marginTop: 10,
    padding: 14,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    alignItems: "center"
  }
});