import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DeviceList from "@screens/Device/DeviceList";
import AddDevice from "@screens/Device/AddDevice";
import DeviceDetail from "@screens/Device/DeviceDetail";
import EditDevice from "@screens/Device/EditDevice";
import DeviceHistory from "@screens/Device/DeviceHistory";

const Stack = createNativeStackNavigator();

export default function DeviceStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DeviceList" component={DeviceList} />
      <Stack.Screen name="AddDevice" component={AddDevice} />
       <Stack.Screen
  name="DeviceDetail"
  component={DeviceDetail}
  options={{ headerShown: false }}
/>
<Stack.Screen
  name="DeviceHistory"
  component={DeviceHistory}
  options={{ headerShown: false }}
/>
       <Stack.Screen name="EditDevice" component={EditDevice} />
    </Stack.Navigator>
  );
}