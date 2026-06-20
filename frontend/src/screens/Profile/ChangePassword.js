import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useStore } from "@store/useStore";
import LoadingOverlay from "@components/LoadingOverlay";

export default function ChangePassword({ navigation }) {
  const { user, changePassword } = useStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /\d/.test(newPassword);
  const hasSymbol = /[!@#$%^&*]/.test(newPassword);

  const handleSave = () => {

  if (!currentPassword) {

    return Alert.alert(
      "Error",
      "Enter current password"
    );

  }

  if (
    user?.password &&
    currentPassword !== user.password
  ) {

    return Alert.alert(
      "Error",
      "Incorrect current password"
    );

  }

  if (
    !hasMinLength ||
    !hasNumber ||
    !hasSymbol
  ) {

    return Alert.alert(
      "Error",
      "Password must meet all requirements"
    );

  }

  if (newPassword !== confirmPassword) {

    return Alert.alert(
      "Error",
      "Passwords do not match"
    );

  }

  Alert.alert(
    "Confirm Password Change",
    "Are you sure you want to update your password?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },

      {
        text: "Update",
        onPress: processPasswordChange
      }
    ]
  );

};
const processPasswordChange = async () => {

  try {

    setLoading(true);

    await new Promise(resolve =>
      setTimeout(resolve, 800)
    );

    await changePassword(
  currentPassword,
  newPassword
);

    Alert.alert(
      "Success",
      "Password updated successfully"
    );

    navigation.goBack();

  } catch (e) {

    Alert.alert(
      "Error",
      e.message
    );

  } finally {

    setLoading(false);

  }

};

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >

          <Text style={styles.title}>Change Password</Text>
          

          {/* CURRENT PASSWORD */}
          <Text style={styles.label}>Current Password</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Enter current password"
              secureTextEntry={!showCurrent}
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
              <Icon name={showCurrent ? "eye-off" : "eye"} size={18} />
            </TouchableOpacity>
          </View>

          {/* NEW PASSWORD */}
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Min. 8 characters"
              secureTextEntry={!showNew}
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              <Icon name={showNew ? "eye-off" : "eye"} size={18} />
            </TouchableOpacity>
          </View>

          {/* RULES */}
          <View style={styles.rules}>
            <Rule text="At least 8 characters" valid={hasMinLength} />
            <Rule text="Include a number" valid={hasNumber} />
            <Rule text="Include a special symbol" valid={hasSymbol} />
          </View>

          {/* CONFIRM PASSWORD */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Re-enter new password"
              secureTextEntry={!showConfirm}
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Icon name={showConfirm ? "eye-off" : "eye"} size={18} />
            </TouchableOpacity>
          </View>

          {/* BUTTON */}
          <TouchableOpacity
  style={[
    styles.btn,
    loading && {
      opacity: 0.7
    }
  ]}
  onPress={handleSave}
  disabled={loading}
>
            <Text style={styles.btnText}>Update Password</Text>
          </TouchableOpacity>

          {/* CANCEL */}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
      <LoadingOverlay
  visible={loading}
  text="Updating password..."
/>
    </SafeAreaView>
  );
}

// -------- RULE COMPONENT --------
const Rule = ({ text, valid }) => (
  <View style={styles.ruleItem}>
    <Icon
      name={valid ? "check-circle" : "circle-outline"}
      size={16}
      color={valid ? "green" : "#94A3B8"}
    />
    <Text style={styles.ruleText}>{text}</Text>
  </View>
);

// -------- STYLES --------
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F6F8" },
  container: { padding: 20, paddingBottom: 40 },

  title: { fontSize: 20, fontWeight: "700" },
  subtitle: { color: "#64748B", marginBottom: 20 },

  label: { marginTop: 12, fontSize: 12, color: "#64748B" },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 6
  },

  input: { flex: 1, paddingVertical: 10 },

  rules: { marginTop: 10 },

  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4
  },

  ruleText: {
    marginLeft: 6,
    fontSize: 12,
    color: "#475569"
  },

  btn: {
    backgroundColor: "#1E3A8A",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20
  },

  btnText: {
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