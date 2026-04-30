import React, { useState } from "react";
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
import { useStore } from "@store/useStore";

const EditParty = ({ route, navigation }) => {
  const { party } = route.params;
  const { updateParty } = useStore();

  const [name, setName] = useState(party.name);
  const [phone, setPhone] = useState(party.phone);
  const [city, setCity] = useState(party.city);
  const [type, setType] = useState(party.type);

  const handleUpdate = () => {
    if (!name || !phone || !city || !type) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    updateParty(party.id, {
      name,
      phone,
      city,
      type
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.container}
      >
        <ScrollView keyboardShouldPersistTaps="handled">

          <View style={styles.header}>
            <Text style={styles.title}>Edit Party</Text>
          </View>

          <View style={styles.card}>

            <InputFields
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />

            <InputFields
              placeholder="Phone"
              value={phone}
              onChangeText={setPhone}
            />

            <InputFields
              placeholder="City"
              value={city}
              onChangeText={setCity}
            />

            <InputFields
              placeholder="Type"
              value={type}
              onChangeText={setType}
            />

            <View style={{ marginTop: 20 }}>
              <PrimaryButton
                title="Update Party"
                onPress={handleUpdate}
              />
            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditParty;

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
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20
  }
});