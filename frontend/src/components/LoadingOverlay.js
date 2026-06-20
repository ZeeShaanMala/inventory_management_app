import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal
} from "react-native";

export default function LoadingOverlay({
  visible = false,
  text = "Loading..."
}) {

  return (

    <Modal
      transparent
      animationType="fade"
      visible={visible}
    >

      <View style={styles.overlay}>

        <View style={styles.container}>

          <ActivityIndicator
            size="large"
            color="#2563EB"
          />

          <Text style={styles.text}>
            {text}
          </Text>

        </View>

      </View>

    </Modal>

  );

}

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center"
  },

  container: {
    backgroundColor: "#fff",
    paddingVertical: 28,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: "center",

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3
    }
  },

  text: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "500",
    color: "#1E293B"
  }

});