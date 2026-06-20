import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Modal
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useStore } from "@store/useStore";
import {
  launchImageLibrary
} from "react-native-image-picker";

export default function ProfileInfo({ navigation }) {
  const { user, updateUser } = useStore();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(
  user?.avatar || null
);
const [showAvatarModal, setShowAvatarModal] = useState(false);

const pickImage = async () => {

  const result = await launchImageLibrary({
    mediaType: "photo",
    quality: 0.7
  });

  if (
    !result.didCancel &&
    result.assets &&
    result.assets.length > 0
  ) {

    setAvatar(
      result.assets[0].uri
    );

  }

};

const removePhoto = () => {

  setAvatar(null);

  setShowAvatarModal(false);

};

  const handleSave = async () => {

  await updateUser({
    name,
    email,
    avatar
  });

  navigation.goBack();

};

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* HEADER */}
        <Text style={styles.title}>Edit Profile</Text>
        <Text style={styles.subtitle}>
  Update your personal account details
</Text>

        {/* AVATAR */}
        <View style={styles.avatarBox}>

  <TouchableOpacity
    style={styles.avatar}
    onPress={() => setShowAvatarModal(true)}
  >

    {
  avatar ? (

    <Image
      source={{ uri: avatar }}
      style={styles.avatarImage}
    />

  ) : (

    <Icon
      name="account"
      size={40}
      color="#fff"
    />

  )
}

  </TouchableOpacity>

  <Text style={styles.avatarText}>
    Update avatar
  </Text>

</View>

        {/* INPUTS */}
        <Input label="FULL NAME" value={name} onChange={setName} />
        <Input label="EMAIL ADDRESS" value={email} onChange={setEmail} />
        
        {/* BUTTONS */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>
  Cancel
</Text>
        </TouchableOpacity>

            </ScrollView>

      {/* AVATAR MODAL */}
      <Modal
        visible={showAvatarModal}
        transparent
        animationType="fade"
      >

        <View style={styles.modalOverlay}>

          <View style={styles.modalBox}>

            {
              avatar ? (

                <Image
                  source={{ uri: avatar }}
                  style={styles.previewImage}
                />

              ) : (

                <View style={styles.emptyPreview}>

                  <Icon
                    name="account"
                    size={70}
                    color="#94A3B8"
                  />

                </View>

              )
            }

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowAvatarModal(false);
                pickImage();
              }}
            >

              <Text style={styles.modalButtonText}>
                Update Photo
              </Text>

            </TouchableOpacity>

            {
              avatar && (

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={removePhoto}
                >

                  <Text style={styles.deleteText}>
                    Remove Photo
                  </Text>

                </TouchableOpacity>

              )
            }

            <TouchableOpacity
              onPress={() => setShowAvatarModal(false)}
            >

              <Text style={styles.cancelText}>
                Cancel
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </Modal>

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
  subtitle: {
  color: "#64748B",
  marginTop: -20,
  marginBottom: 10
},

  avatarBox: {
  alignItems: "center",
  marginBottom: 25,
  backgroundColor: "#f7f7f7",
  paddingVertical: 25,
  borderRadius: 20,
  backgroundColor: "#ffffff",
  elevation: 3,
shadowColor: "#000",
  elevation: 2,
  shadowColor: "#000",
  shadowOpacity: 0.04,
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 2
  }
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

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40
  },

  inputGroup: { marginBottom: 15 },

  label: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 4
  },

  input: {
  backgroundColor: "#fff",
  borderRadius: 12,
  padding: 14,
  borderWidth: 1,
  borderColor: "#E2E8F0"
},

  saveBtn: {
    backgroundColor: "#1E3A8A",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
shadowColor: "#000",
shadowOpacity: 0.04,
shadowRadius: 8,
shadowOffset: {
  width: 0,
  height: 2
}
  },

  saveText: {
    color: "#fff",
    fontWeight: "600"
  },

  cancelBtn: {
  marginTop: 12,
  padding: 14,
  borderRadius: 10,
  alignItems: "center"
},
cancelText: {
  color: "#64748B",
  fontWeight: "600"
},
modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center"
},

modalBox: {
  width: "85%",
  backgroundColor: "#fff",
  borderRadius: 20,
  padding: 20,
  alignItems: "center"
},

previewImage: {
  width: 180,
  height: 180,
  borderRadius: 90,
  marginBottom: 20
},

emptyPreview: {
  width: 180,
  height: 180,
  borderRadius: 90,
  backgroundColor: "#F1F5F9",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 20
},

modalButton: {
  width: "100%",
  backgroundColor: "#1E3A8A",
  padding: 14,
  borderRadius: 12,
  alignItems: "center",
  marginBottom: 10
},

modalButtonText: {
  color: "#fff",
  fontWeight: "600"
},

deleteButton: {
  width: "100%",
  backgroundColor: "#FEE2E2",
  padding: 14,
  borderRadius: 12,
  alignItems: "center",
  marginBottom: 10
},

deleteText: {
  color: "#DC2626",
  fontWeight: "600"
}
});