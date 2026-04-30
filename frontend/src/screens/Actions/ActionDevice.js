import React from "react";
import { View, Text } from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import { useStore } from "@store/useStore";

export default function ActionDevice({ route, navigation }) {
  const { imei, action } = route.params;

  const unassignDevice = useStore(state => state.unassignDevice);
  const returnDevice = useStore(state => state.returnDevice);

  const isReturn = action === "return";

  const handleConfirm = () => {
  if (action === "return") {
    returnDevice(imei);
  } else if (action === "unassign") {
    unassignDevice(imei);
  }

  navigation.goBack();
};

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        {isReturn
          ? "This device will be returned to stock."
          : "This device will be unassigned and moved back to stock."}
      </Text>

      <PrimaryButton
        title={isReturn ? "Confirm Return" : "Confirm Unassign"}
        onPress={handleConfirm}
      />
    </View>
  );
}